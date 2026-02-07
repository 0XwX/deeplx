// Edge Function entry - Multi-provider auto-failover + KV logging
// Note: deeplx is a global KV binding injected by EdgeOne runtime

import { createDefaultRegistry } from '../src/providers/index.js'
import { getDefaultConfig } from '../src/config.js'
import { withRetry } from '../src/utils/retry.js'
import { withTimeout } from '../src/utils/timeout.js'
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from '../src/deeplx/constants.js'

// Initialize provider registry and config
const registry = createDefaultRegistry()
const config = getDefaultConfig()

// Config constants
const PROVIDERS = config.get('providers')
const HEALTH_TIMEOUT = config.get('healthTimeout')
const MAX_TEXT_LENGTH = config.get('maxTextLength')
const REQUEST_TIMEOUT = config.get('providerTimeout')
const MAX_RETRIES = config.get('retryCount')
const RETRY_DELAY = config.get('retryDelay')
const RETRY_BACKOFF = config.get('retryBackoff')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const json = (data, status = HTTP_STATUS_OK) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })

/**
 * Validate API Token
 * @param {Request} request - Request object
 * @param {object} env - Environment variables object
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
function validateToken(request, env) {
  // Get configured TOKEN from environment variables (optional)
  const configuredToken = env?.TOKEN

  // If TOKEN is not configured, allow all requests
  if (!configuredToken) {
    return { valid: true }
  }

  // 1. Try URL query parameter first
  const url = new URL(request.url)
  let providedToken = url.searchParams.get('token')

  // 2. Fallback to Authorization header
  if (!providedToken) {
    const authHeader = request.headers.get('Authorization')
    providedToken = authHeader?.replace(/^Bearer\s+/i, '')
  }

  // Validate token
  if (!providedToken || providedToken !== configuredToken) {
    return { valid: false, error: 'Unauthorized: Invalid or missing token' }
  }

  return { valid: true }
}

// OPTIONS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

// GET returns usage instructions
export async function onRequestGet() {
  return new Response(
    'DeepL Translate API\n\nPOST {"text": "Hello", "source_lang": "auto", "target_lang": "ZH"} to /translate',
    { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders } },
  )
}

// POST translation request
export async function onRequestPost({ request, env }) {
  const startTime = Date.now()
  const today = new Date(startTime).toISOString().split('T')[0]

  // TOKEN authentication check (if TOKEN environment variable is configured)
  const authResult = validateToken(request, env)
  if (!authResult.valid) {
    return json(
      { code: HTTP_STATUS_UNAUTHORIZED, data: authResult.error },
      HTTP_STATUS_UNAUTHORIZED,
    )
  }

  // Get client identifier (for audit logs)
  const clientId =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'

  // Parse request body
  let params
  try {
    let rawText = await request.text()
    // EdgeOne platform incorrectly escapes certain special characters (like !) to \!
    // This regex removes invalid escapes, keeping only valid JSON escape characters
    rawText = rawText.replace(/\\([^"\\/bfnrtu])/g, '$1')
    params = JSON.parse(rawText)
  } catch (err) {
    console.error('Failed to parse request JSON:', err)
    return json({ code: HTTP_STATUS_BAD_REQUEST, data: 'Invalid JSON' }, HTTP_STATUS_BAD_REQUEST)
  }

  const { text, source_lang: sourceLang, target_lang: targetLang } = params

  // Input validation
  if (!text) {
    return json(
      { code: HTTP_STATUS_BAD_REQUEST, data: 'Text is required' },
      HTTP_STATUS_BAD_REQUEST,
    )
  }
  if (typeof text !== 'string') {
    return json(
      { code: HTTP_STATUS_BAD_REQUEST, data: 'Text must be a string' },
      HTTP_STATUS_BAD_REQUEST,
    )
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return json(
      {
        code: HTTP_STATUS_BAD_REQUEST,
        data: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`,
      },
      HTTP_STATUS_BAD_REQUEST,
    )
  }
  if (!targetLang) {
    return json(
      { code: HTTP_STATUS_BAD_REQUEST, data: 'target_lang is required' },
      HTTP_STATUS_BAD_REQUEST,
    )
  }
  if (typeof targetLang !== 'string' || !/^[a-zA-Z]{2,5}(-[a-zA-Z]{2,5})?$/.test(targetLang)) {
    return json(
      { code: HTTP_STATUS_BAD_REQUEST, data: 'Invalid target_lang format' },
      HTTP_STATUS_BAD_REQUEST,
    )
  }

  // Translation parameters
  const translateParams = {
    text,
    sourceLang: sourceLang || 'auto',
    targetLang,
  }

  // Get all providers ordered by config
  const allProviders = PROVIDERS.map((name) => registry.get(name)).filter(Boolean)
  const skippedProviders = []

  // Filter providers that support this request, record skipped ones
  const providers = []
  for (const provider of allProviders) {
    if (provider.supports(translateParams)) {
      providers.push(provider)
    } else {
      skippedProviders.push({
        name: provider.name,
        reason: `Text exceeds ${provider.maxTextLength} characters`,
      })
    }
  }

  // Multi-provider auto-failover
  let result = null
  let usedProvider = null
  let failover = false

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]

    // Check provider health status in KV
    try {
      const health = await deeplx.get(`health:${provider.name}`, { type: 'json' })
      if (health?.status === 'down' && Date.now() - health.lastCheck < HEALTH_TIMEOUT) {
        continue // Skip provider recently marked as down
      }
    } catch (e) {
      // KV read failed, log warning and continue
      console.warn(`KV health read for ${provider.name} failed, proceeding...`, e)
    }

    try {
      // Call provider (with timeout and retry)
      const abortController = new AbortController()
      const providerResult = await withRetry(
        () =>
          withTimeout(
            provider.translate(translateParams, { env, signal: abortController.signal }),
            provider.timeout || REQUEST_TIMEOUT,
            undefined,
            () => abortController.abort(),
          ),
        { retries: MAX_RETRIES, delay: RETRY_DELAY, backoff: RETRY_BACKOFF },
      )

      if (providerResult.code === HTTP_STATUS_OK) {
        result = providerResult
        usedProvider = provider.name
        failover = i > 0

        // Mark provider as healthy (non-blocking)
        deeplx
          .put(
            `health:${provider.name}`,
            JSON.stringify({
              status: 'up',
              lastCheck: Date.now(),
            }),
          )
          .catch((e) => console.error('KV health write failed:', e))
        break
      } else if (providerResult.code >= 400 && providerResult.code < 500) {
        // 4xx client error: return error directly, don't mark provider as down
        console.warn(`Provider ${provider.name} returned client error ${providerResult.code}`)
        return json(
          {
            code: providerResult.code,
            data: providerResult.error || `Request error: ${providerResult.code}`,
          },
          providerResult.code,
        )
      } else {
        // 5xx server error: mark provider as down, try next
        console.error(`Provider ${provider.name} returned ${providerResult.code}`)
        deeplx
          .put(
            `health:${provider.name}`,
            JSON.stringify({
              status: 'down',
              lastCheck: Date.now(),
              reason: providerResult.error || `HTTP ${providerResult.code}`,
            }),
          )
          .catch((e) => console.error('KV health write failed:', e))
      }
    } catch (err) {
      // Network/timeout error: mark provider as down
      console.error(`Provider ${provider.name} error after retries:`, err.message)
      deeplx
        .put(
          `health:${provider.name}`,
          JSON.stringify({
            status: 'down',
            lastCheck: Date.now(),
            reason: err.message || 'Network error',
          }),
        )
        .catch((e) => console.error('KV health write failed:', e))
    }
  }

  if (!result) {
    const response = {
      code: HTTP_STATUS_SERVICE_UNAVAILABLE,
      data: 'Translation service temporarily unavailable',
    }
    // Add skipped provider info to help users understand the failure
    if (skippedProviders.length > 0) {
      response.skipped = skippedProviders
    }
    return json(response, HTTP_STATUS_SERVICE_UNAVAILABLE)
  }

  // Async write request log to KV
  const latency = Date.now() - startTime
  const logKey = `log:${today}:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const logValue = JSON.stringify({
    timestamp: new Date(startTime).toISOString(),
    action: 'translate',
    clientId,
    provider: usedProvider,
    failover,
    sourceLang: sourceLang || 'auto',
    targetLang,
    textLength: text.length,
    latency,
    success: result.code === HTTP_STATUS_OK,
  })

  // Non-blocking log write
  deeplx.put(logKey, logValue).catch((e) => console.error('KV log write failed:', e))

  // Build response
  return json({
    code: HTTP_STATUS_OK,
    data: result.data,
    id: result.id || Math.floor(Math.random() * 10000000000), // Prefer provider's original ID
    source_lang: result.sourceLang,
    target_lang: result.targetLang,
    alternatives: result.alternatives || [],
    method: result.method || 'Free',
    provider: usedProvider,
    ...(failover && { failover: true }),
  })
}
