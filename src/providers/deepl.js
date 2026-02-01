/**
 * DeepL Provider
 * Uses DeepL JSON-RPC API for translation
 */
import { BaseProvider } from './base.js'
import { translateByDeepLX } from '../deeplx/translate.js'
import { abbreviateLanguage } from '../deeplx/utils.js'
import { HTTP_STATUS_OK, HTTP_STATUS_SERVICE_UNAVAILABLE } from '../deeplx/constants.js'

export class DeepLProvider extends BaseProvider {
  constructor(options = {}) {
    super('deepl', {
      priority: 10, // High priority
      maxTextLength: 5000,
      timeout: 15000, // DeepL is slower to respond
      ...options,
    })
  }

  /**
   * Validate language codes
   */
  validateParams(params) {
    const base = super.validateParams(params)
    if (!base.valid) return base

    // Validate if target language is supported
    if (!abbreviateLanguage(params.targetLang)) {
      return { valid: false, error: 'Invalid target language for DeepL' }
    }

    return { valid: true }
  }

  /**
   * Execute translation
   */
  async translate(params, context = {}) {
    const { text, sourceLang = 'auto', targetLang } = params

    try {
      const result = await translateByDeepLX(
        sourceLang,
        targetLang,
        text,
        context.env?.DEEPL_SESSION, // Optional Pro session
      )

      if (result.code === HTTP_STATUS_OK) {
        return {
          code: HTTP_STATUS_OK,
          id: result.id, // Preserve DeepL original ID
          data: result.data,
          sourceLang: result.sourceLang,
          targetLang: result.targetLang,
          alternatives: result.alternatives,
          method: result.method,
        }
      }

      return {
        code: result.code,
        error: result.message || 'Translation failed',
      }
    } catch (err) {
      return {
        code: HTTP_STATUS_SERVICE_UNAVAILABLE,
        error: err.message || 'DeepL API error',
      }
    }
  }
}
