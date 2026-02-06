import type { Translations } from '../types'

export const enTranslations: Translations = {
  // Header
  appTitle: 'DeepLX',
  appSubtitle: 'Free, unlimited DeepL API',
  language: 'Language',

  // Form
  sourceLanguage: 'Source Language',
  targetLanguage: 'Target Language',
  autoDetect: 'Auto Detect',
  enterText: 'Enter text to translate...',
  translationResult: 'Translation Result',
  translate: 'Translate',
  translating: 'Translating...',
  clear: 'Clear',
  copy: 'Copy',
  copied: 'Copied!',
  swapLanguages: 'Swap languages',

  // Settings
  settings: 'Settings',
  apiEndpoint: 'API Endpoint',
  apiEndpointDesc: 'Custom translation API endpoint URL',
  theme: 'Theme',
  system: 'System',
  light: 'Light',
  dark: 'Dark',

  // History
  history: 'History',
  noHistory: 'No translation history',
  clearHistory: 'Clear History',
  clearHistoryConfirm: 'Are you sure you want to clear all history?',

  // Errors
  translationFailed: 'Translation failed',
  networkError: 'Network error, please check your connection',
  invalidResponse: 'Invalid response from server',
  rateLimitError: 'Too many requests, please try again later',
  unknownError: 'Unknown error occurred',
  unauthorizedError: 'Server requires Token authentication. Please configure your Token.',

  // Footer
  poweredBy: 'Powered by DeepLX',

  // Hero Section
  heroBadge: '100% Free · No API Key Required',
  heroTitle: 'Powerful DeepL Translation API',
  heroSubtitle: 'Integrate DeepLX into any application and enjoy high-quality machine translation',
  startTranslating: 'Start Translating',
  apiDocs: 'API Docs',

  // Features
  free: 'Free',
  freeDesc: 'No payment required, free forever',
  fast: 'Fast',
  fastDesc: 'Translation speed far exceeds OpenAI',
  secure: 'Secure',
  secureDesc: 'Open source, you can view all source code and self-host',
  simple: 'Simple',
  simpleDesc: 'Easily integrate into any application',

  // Translate Section
  onlineTranslation: 'Online Translation',
  enterTextHint: 'Enter text and get translation instantly',

  // API Section
  apiUsage: 'API Usage',
  apiUsageDesc: 'Simple HTTP request to call translation service',

  // Settings Additional
  apiToken: 'API Token',
  apiTokenPlaceholder: 'Optional, for authentication',
  apiTokenDesc: 'Required if server has TOKEN environment variable configured',
  autoTranslate: 'Auto Translate',
  autoTranslateDesc: 'Automatically translate after typing stops',
  autoTranslateDelay: 'Auto Translate Delay',
  autoTranslateDelayDesc: 'Wait time after typing stops before translating',
  themeDesc: 'Choose interface color theme, "System" follows OS settings',
  shortcuts: 'Shortcuts: Ctrl+Enter to translate | Esc to close panel',
  apiEndpointPlaceholder: 'Leave empty to use current domain',

  // Footer Additional
  website: 'DeepLX',
}
