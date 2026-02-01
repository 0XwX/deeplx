/**
 * Provider registry
 * Manages registration and retrieval of all translation providers
 */
import { DeepLProvider } from './deepl.js'
import { GoogleProvider } from './google.js'

export class ProviderRegistry {
  constructor() {
    this.providers = new Map()
  }

  /**
   * Register a provider
   * @param {BaseProvider} provider - Provider instance
   * @returns {ProviderRegistry} Supports method chaining
   */
  register(provider) {
    this.providers.set(provider.name, provider)
    return this
  }

  /**
   * Get a specific provider
   * @param {string} name - Provider name
   * @returns {BaseProvider|undefined}
   */
  get(name) {
    return this.providers.get(name)
  }

  /**
   * Get all provider names
   * @returns {string[]}
   */
  names() {
    return Array.from(this.providers.keys())
  }

  /**
   * Get available providers sorted by priority
   * @param {Object} params - Translation parameters
   * @returns {BaseProvider[]}
   */
  getAvailable(params) {
    return Array.from(this.providers.values())
      .filter((p) => p.supports(params))
      .sort((a, b) => b.priority - a.priority)
  }

  /**
   * Get providers in specified order
   * @param {string[]} names - Provider name list
   * @param {Object} params - Translation parameters
   * @returns {BaseProvider[]}
   */
  getByOrder(names, params) {
    return names.map((name) => this.providers.get(name)).filter((p) => p && p.supports(params))
  }
}

/**
 * Create default provider registry
 * @returns {ProviderRegistry}
 */
export function createDefaultRegistry() {
  return new ProviderRegistry().register(new DeepLProvider()).register(new GoogleProvider())
}

// Export provider classes
export { DeepLProvider } from './deepl.js'
export { GoogleProvider } from './google.js'
export { BaseProvider } from './base.js'
