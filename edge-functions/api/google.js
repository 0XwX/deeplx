import { GoogleProvider } from '../../src/providers/google.js'
import { parseRequestBody } from '../../src/deeplx/utils.js'
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_INTERNAL_ERROR,
} from '../../src/deeplx/constants.js'

const provider = new GoogleProvider()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

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

const json = (data, status = HTTP_STATUS_OK) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export async function onRequestGet() {
  return new Response('POST to /api/google with {"text": "...", "target_lang": "ZH"}', {
    status: HTTP_STATUS_OK,
    headers: { 'Content-Type': 'text/plain', ...corsHeaders },
  })
}

export async function onRequestPost({ request, env }) {
  const authResult = validateToken(request, env)
  if (!authResult.valid) {
    return json(
      { code: HTTP_STATUS_UNAUTHORIZED, data: authResult.error },
      HTTP_STATUS_UNAUTHORIZED,
    )
  }

  const parsed = await parseRequestBody(request)
  if (!parsed.success) {
    return json({ code: HTTP_STATUS_BAD_REQUEST, data: parsed.error }, HTTP_STATUS_BAD_REQUEST)
  }

  const { text, source_lang: sourceLang, target_lang: targetLang } = parsed.data

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
  if (!targetLang) {
    return json(
      { code: HTTP_STATUS_BAD_REQUEST, data: 'target_lang is required' },
      HTTP_STATUS_BAD_REQUEST,
    )
  }
  if (typeof targetLang !== 'string') {
    return json(
      { code: HTTP_STATUS_BAD_REQUEST, data: 'target_lang must be a string' },
      HTTP_STATUS_BAD_REQUEST,
    )
  }
  if (sourceLang && typeof sourceLang !== 'string') {
    return json(
      { code: HTTP_STATUS_BAD_REQUEST, data: 'source_lang must be a string' },
      HTTP_STATUS_BAD_REQUEST,
    )
  }

  if (!provider.supports({ text })) {
    return json(
      {
        code: HTTP_STATUS_BAD_REQUEST,
        data: `Text too long for Google Translate (max ${provider.maxTextLength} chars). Use DeepL for longer texts.`,
      },
      HTTP_STATUS_BAD_REQUEST,
    )
  }

  try {
    const result = await provider.translate(
      { text, sourceLang: sourceLang || 'auto', targetLang },
      { env: {} },
    )

    if (result.code === HTTP_STATUS_OK) {
      return json({
        code: HTTP_STATUS_OK,
        data: result.data,
        id: Math.floor(Math.random() * 10000000000),
        source_lang: result.sourceLang,
        target_lang: result.targetLang,
        method: result.method,
      })
    } else {
      console.error(`Google translation failed. Code: ${result.code}, Error: ${result.error}`)
      return json({ code: result.code, data: result.error || 'Translation failed' }, result.code)
    }
  } catch (err) {
    console.error('Internal server error in /api/google:', err)
    return json(
      { code: HTTP_STATUS_INTERNAL_ERROR, data: 'Internal server error' },
      HTTP_STATUS_INTERNAL_ERROR,
    )
  }
}
