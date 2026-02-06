export type Locale = 'en' | 'zh'

export interface Translations {
  // Header
  appTitle: string
  appSubtitle: string
  language: string

  // Form
  sourceLanguage: string
  targetLanguage: string
  autoDetect: string
  enterText: string
  translationResult: string
  translate: string
  translating: string
  clear: string
  copy: string
  copied: string
  swapLanguages: string

  // Settings
  settings: string
  apiEndpoint: string
  apiEndpointDesc: string
  theme: string
  system: string
  light: string
  dark: string

  // History
  history: string
  noHistory: string
  clearHistory: string
  clearHistoryConfirm: string

  // Errors
  translationFailed: string
  networkError: string
  invalidResponse: string
  rateLimitError: string
  unknownError: string
  unauthorizedError: string

  // Footer
  poweredBy: string

  // Hero Section
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  startTranslating: string
  apiDocs: string

  // Features
  free: string
  freeDesc: string
  fast: string
  fastDesc: string
  secure: string
  secureDesc: string
  simple: string
  simpleDesc: string

  // Translate Section
  onlineTranslation: string
  enterTextHint: string

  // API Section
  apiUsage: string
  apiUsageDesc: string

  // Settings Additional
  apiToken: string
  apiTokenPlaceholder: string
  apiTokenDesc: string
  autoTranslate: string
  autoTranslateDesc: string
  autoTranslateDelay: string
  autoTranslateDelayDesc: string
  themeDesc: string
  shortcuts: string
  apiEndpointPlaceholder: string

  // Footer Additional
  website: string
}

export interface I18nContextType {
  locale: Locale
  t: (key: keyof Translations) => string
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}
