import type { Locale } from './types'

const STORAGE_KEY = 'deeplx-locale'

/**
 * Detect browser language
 */
export function detectBrowserLanguage(): Locale {
  if (typeof navigator === 'undefined') return 'en'

  const lang = navigator.language.toLowerCase()

  // Check for Chinese variants
  if (lang.startsWith('zh')) {
    return 'zh'
  }

  // Default to English for other languages
  return 'en'
}

/**
 * Get stored locale from localStorage
 */
export function getStoredLocale(): Locale | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') {
      return stored
    }
  } catch {
    // localStorage might be disabled
  }

  return null
}

/**
 * Store locale in localStorage
 */
export function storeLocale(locale: Locale): void {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // localStorage might be disabled
  }
}

/**
 * Get initial locale (stored > browser detection > default)
 */
export function getInitialLocale(): Locale {
  return getStoredLocale() || detectBrowserLanguage()
}
