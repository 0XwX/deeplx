/**
 * Configuration management module
 * Priority: Environment variables > KV storage > Default values
 */

// Default configuration
const DEFAULTS = {
  // Provider configuration
  providers: ['deepl', 'google'],
  providerTimeout: 15000,

  // Retry configuration
  retryCount: 2,
  retryDelay: 1000,
  retryBackoff: 2,

  // Health check
  healthTimeout: 30000,

  // Request limits
  maxTextLength: 5000,

  // Cache configuration (KV has no TTL, manual expiration required)
  cacheEnabled: false,
  cacheMaxAge: 3600000, // 1 hour (milliseconds)
}

/**
 * Configuration manager
 */
export class Config {
  constructor(env = {}, kvConfig = {}) {
    this.env = env
    this.kvConfig = kvConfig
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key name
   * @param {*} defaultValue - Default value (optional, DEFAULTS takes precedence)
   */
  get(key, defaultValue) {
    // 1. Environment variables (EdgeOne env, converted to UPPER_SNAKE_CASE format)
    const envKey = `DEEPLX_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`
    if (this.env[envKey] !== undefined) {
      return this.parseValue(this.env[envKey])
    }

    // 2. KV configuration (hot-reloadable)
    if (this.kvConfig[key] !== undefined) {
      return this.kvConfig[key]
    }

    // 3. Default values
    return defaultValue ?? DEFAULTS[key]
  }

  /**
   * Parse environment variable value types
   */
  parseValue(value) {
    if (value === 'true') return true
    if (value === 'false') return false
    if (/^\d+$/.test(value)) return parseInt(value, 10)
    if (value.includes(',')) return value.split(',').map((s) => s.trim())
    return value
  }

  /**
   * Load configuration from KV
   * @param {KVNamespace} kv - EdgeOne KV binding
   */
  static async loadFromKV(kv) {
    if (!kv) return {}
    try {
      const config = await kv.get('config:global', { type: 'json' })
      return config || {}
    } catch (err) {
      console.error('Failed to load config from KV:', err)
      return {}
    }
  }
}

/**
 * Create configuration instance
 * @param {Object} env - EdgeOne environment variables
 * @param {KVNamespace} kv - EdgeOne KV binding (optional)
 */
export async function createConfig(env, kv) {
  const kvConfig = await Config.loadFromKV(kv)
  return new Config(env, kvConfig)
}

/**
 * Get default configuration (without loading KV)
 */
export function getDefaultConfig() {
  return new Config({}, {})
}
