// GET /stats - Monitoring endpoint
// Note: deeplx is a global KV binding injected by EdgeOne runtime

const LOG_LIST_LIMIT = 256

export async function onRequestGet() {
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
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
