/**
 * Timeout utility module
 * Implemented using Promise.race, compatible with EdgeOne runtime
 */

/**
 * Add timeout limit to a Promise
 * @param {Promise} promise - Promise to execute
 * @param {number} ms - Timeout in milliseconds
 * @param {string} message - Timeout error message (optional)
 * @param {Function} onTimeout - Optional callback when timeout triggers
 * @returns {Promise<*>} Original Promise result or timeout error
 */
export function withTimeout(promise, ms, message, onTimeout) {
  const timeoutMessage = message || `Request timeout after ${ms}ms`
  let timeoutId

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      if (typeof onTimeout === 'function') {
        try {
          onTimeout()
        } catch {
          // ignore onTimeout errors
        }
      }
      reject(new TimeoutError(timeoutMessage, ms))
    }, ms)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId))
}

/**
 * Timeout error class
 */
export class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message)
    this.name = 'TimeoutError'
    this.timeout = timeout
  }
}

/**
 * Check if error is a timeout error
 * @param {Error} err - Error object
 */
export function isTimeoutError(err) {
  return err instanceof TimeoutError || err.name === 'TimeoutError'
}
