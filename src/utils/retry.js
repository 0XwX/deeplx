/**
 * Retry utility module
 * Supports exponential backoff strategy
 */

/**
 * Execute function with retry
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.retries - Maximum retry count (default 2)
 * @param {number} options.delay - Initial delay in milliseconds (default 1000)
 * @param {number} options.backoff - Backoff factor (default 2)
 * @param {Function} options.shouldRetry - Function to determine if retry should occur (default retry all errors)
 * @returns {Promise<*>} Function execution result
 */
export async function withRetry(fn, options = {}) {
  const { retries = 2, delay = 1000, backoff = 2, shouldRetry = () => true } = options

  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err

      // Check if should retry
      if (attempt >= retries || !shouldRetry(err, attempt)) {
        throw err
      }

      // Calculate delay time (exponential backoff)
      const waitTime = delay * Math.pow(backoff, attempt)
      await sleep(waitTime)
    }
  }
  throw lastError
}

/**
 * Sleep function
 * @param {number} ms - Delay in milliseconds
 */
export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
