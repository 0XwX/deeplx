/**
 * Provider abstract base class
 * All translation providers must extend this class
 */
export class BaseProvider {
  /**
   * @param {string} name - Provider name
   * @param {Object} options - Configuration options
   * @param {number} options.priority - Priority (higher value = higher priority)
   * @param {number} options.maxTextLength - Maximum text length
   * @param {number} options.timeout - Request timeout in milliseconds
   */
  constructor(name, options = {}) {
    this.name = name
    this.priority = options.priority ?? 0
    this.maxTextLength = options.maxTextLength ?? 5000
    this.timeout = options.timeout ?? 15000
  }

  /**
   * Check if provider supports this request
   * @param {Object} params - Translation parameters
   * @param {string} params.text - Text to translate
   * @param {string} params.targetLang - Target language
   * @returns {boolean}
   */
  supports(params) {
    return params.text.length <= this.maxTextLength
  }

  /**
   * Validate request parameters
   * @param {Object} params - Translation parameters
   * @returns {{ valid: boolean, error?: string }}
   */
  validateParams(params) {
    if (!params.text) {
      return { valid: false, error: 'Text is required' }
    }
    if (typeof params.text !== 'string') {
      return { valid: false, error: 'Text must be a string' }
    }
    if (params.text.length > this.maxTextLength) {
      return { valid: false, error: `Text exceeds ${this.maxTextLength} characters` }
    }
    if (!params.targetLang) {
      return { valid: false, error: 'target_lang is required' }
    }
    return { valid: true }
  }

  /**
   * Execute translation (must be implemented by subclasses)
   * @param {Object} params - Translation parameters
   * @param {string} params.text - Text to translate
   * @param {string} params.sourceLang - Source language
   * @param {string} params.targetLang - Target language
   * @param {Object} context - Context
   * @param {Object} context.env - Environment variables
   * @returns {Promise<TranslateResult>}
   */
  async translate(_params, _context) {
    throw new Error(`${this.name}: translate() must be implemented`)
  }
}

/**
 * @typedef {Object} TranslateResult
 * @property {number} code - HTTP status code
 * @property {string} [data] - Translation result
 * @property {string} [error] - Error message
 * @property {string} [sourceLang] - Detected source language
 * @property {string} [targetLang] - Target language
 * @property {string[]} [alternatives] - Alternative translations
 * @property {string} [method] - Translation method (Free/Pro)
 */
