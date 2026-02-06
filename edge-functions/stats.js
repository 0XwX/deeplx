// GET /stats - Monitoring endpoint
// Note: deeplx is a global KV binding injected by EdgeOne runtime

import { HTTP_STATUS_UNAUTHORIZED } from '../src/deeplx/constants.js'

const LOG_LIST_LIMIT = 256

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

/**
 * Validate API Token
 * @param {Request} request - Request object
 * @param {object} env - Environment variables object
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
function validateToken(request, env) {
  const configuredToken = env?.TOKEN
  if (!configuredToken) {
    return { valid: true }
  }

  const url = new URL(request.url)
  let providedToken = url.searchParams.get('token')

  if (!providedToken) {
    const authHeader = request.headers.get('Authorization')
    providedToken = authHeader?.replace(/^Bearer\s+/i, '')
  }

  if (!providedToken || providedToken !== configuredToken) {
    return { valid: false, error: 'Unauthorized: Invalid or missing token' }
  }

  return { valid: true }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export async function onRequestGet({ request, env }) {
  const authResult = validateToken(request, env)
  if (!authResult.valid) {
    return new Response(
      JSON.stringify({ code: HTTP_STATUS_UNAUTHORIZED, data: authResult.error }),
      {
        status: HTTP_STATUS_UNAUTHORIZED,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  }
  const today = new Date().toISOString().split('T')[0]

  // Get provider health status
  let deeplHealth = null
  let googleHealth = null
  let todayLogs = { keys: [] }

  // Use Promise.allSettled to handle partial failures
  const results = await Promise.allSettled([
    deeplx.get('health:deepl', { type: 'json' }),
    deeplx.get('health:google', { type: 'json' }),
    deeplx.list({ prefix: `log:${today}`, limit: LOG_LIST_LIMIT }),
  ])

  deeplHealth = results[0].status === 'fulfilled' ? results[0].value : null
  googleHealth = results[1].status === 'fulfilled' ? results[1].value : null
  todayLogs = results[2].status === 'fulfilled' ? results[2].value : { keys: [] }

  // Log failed requests
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`KV fetch failed for index ${i}:`, r.reason)
    }
  })

  const requestCount = todayLogs?.keys?.length || 0

  // Today's statistics
  const stats = {
    providers: {
      deepl: deeplHealth || { status: 'unknown' },
      google: googleHealth || { status: 'unknown' },
    },
    today: {
      date: today,
      requests: requestCount,
      // Requests exceeding limit won't be counted
      sampled: requestCount >= LOG_LIST_LIMIT,
    },
  }

  return new Response(JSON.stringify(stats, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}
