/**
 * Google Translate Provider
 * Uses Google Translate internal API
 */
import { BaseProvider } from './base.js'
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_ERROR,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from '../deeplx/constants.js'

// Google Translate GET API URL length limit
const MAX_TEXT_LENGTH_FOR_GET = 1500

export class GoogleProvider extends BaseProvider {
  constructor(options = {}) {
    super('google', {
      priority: 5, // Lower than DeepL
      maxTextLength: MAX_TEXT_LENGTH_FOR_GET,
      timeout: 10000,
      ...options,
    })
  }

  /**
   * Check if supported (Google only supports short texts)
   */
  supports(params) {
    return params.text.length <= this.maxTextLength
  }

  /**
   * Execute translation
   */
  async translate(params, context = {}) {
    const { text, sourceLang = 'auto', targetLang } = params

    // Construct Google Translate internal API URL
    const url = new URL('https://translate.google.com/translate_a/single')
    url.searchParams.set('client', 'gtx')
    url.searchParams.set('sl', sourceLang === 'auto' ? 'auto' : sourceLang.toLowerCase())
    url.searchParams.set('tl', targetLang.toLowerCase())
    url.searchParams.set('dt', 't')
    url.searchParams.set('q', text)

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://translate.google.com/',
        },
        signal: context.signal,
      })

      if (!res.ok) {
        return {
          code: res.status,
          error: `Google Translate API error: ${res.status}`,
        }
      }

      const data = await res.json()

      // Parse Google Translate response format: [[["translation", "original"], ...], ...]
      const translated =
        data?.[0]
          ?.map((seg) => seg?.[0])
          .filter(Boolean)
          .join('') || ''

      if (!translated) {
        return {
          code: HTTP_STATUS_INTERNAL_ERROR,
          error: 'No translation result from Google',
        }
      }

      // Detected source language
      const detectedLang = data?.[2] || sourceLang || 'auto'

      return {
        code: HTTP_STATUS_OK,
        data: translated,
        sourceLang: detectedLang.toUpperCase(),
        targetLang: targetLang.toUpperCase(),
        method: 'Free',
      }
    } catch (err) {
      return {
        code: HTTP_STATUS_SERVICE_UNAVAILABLE,
        error: err.message || 'Google Translate API error',
      }
    }
  }
}
