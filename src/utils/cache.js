/**
 * Cache utility module
 * Adapted for EdgeOne KV (no TTL support, manual expiration required)
 */

/**
 * Get cached value with expiration check
 * @param {KVNamespace} kv - EdgeOne KV binding
 * @param {string} key - Cache key
 * @param {number} maxAge - Maximum age in milliseconds (default 1 hour)
 * @returns {Promise<*|null>} Cached value or null
 */
export async function getWithExpiry(kv, key, maxAge = 3600000) {
  if (!kv) return null

  try {
    const item = await kv.get(key, { type: 'json' })
    if (!item) return null

    // Check if expired
    if (Date.now() - item.createdAt > maxAge) {
      // Expired, delete asynchronously (non-blocking)
      kv.delete(key).catch(() => {})
      return null
    }

    return item.data
  } catch (err) {
    console.error('Cache get failed:', err)
    return null
  }
}

/**
 * Set cached value with timestamp
 * @param {KVNamespace} kv - EdgeOne KV binding
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @returns {Promise<void>}
 */
export async function setWithTimestamp(kv, key, data) {
  if (!kv) return

  try {
    await kv.put(
      key,
      JSON.stringify({
        data,
        createdAt: Date.now(),
      }),
    )
  } catch (err) {
    console.error('Cache set failed:', err)
  }
}

/**
 * Generate cache key
 * @param {string} text - Source text
 * @param {string} targetLang - Target language
 * @returns {string} Cache key
 */
export function generateCacheKey(text, targetLang) {
  const hash = hashText(text)
  return `cache:${targetLang.toLowerCase()}:${hash}`
}

/**
 * Simple string hash function
 * @param {string} text - Input text
 * @returns {string} Hash value (base36)
 */
function hashText(text) {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}
