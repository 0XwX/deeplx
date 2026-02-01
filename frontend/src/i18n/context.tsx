import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Locale, I18nContextType, Translations } from './types'
import { enTranslations } from './locales/en'
import { zhTranslations } from './locales/zh'
import { getInitialLocale, storeLocale } from './utils'

const I18nContext = createContext<I18nContextType | null>(null)

const translations: Record<Locale, Translations> = {
  en: enTranslations,
  zh: zhTranslations,
}

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    storeLocale(newLocale)
  }, [])

  const toggleLocale = useCallback(() => {
    const newLocale = locale === 'en' ? 'zh' : 'en'
    setLocale(newLocale)
  }, [locale, setLocale])

  const t = useCallback(
    (key: keyof Translations): string => {
      return translations[locale][key] || String(key)
    },
    [locale]
  )

  const value = useMemo(
    () => ({
      locale,
      t,
      setLocale,
      toggleLocale,
    }),
    [locale, t, setLocale, toggleLocale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
