export interface TranslateRequest {
  text: string
  source_lang: string
  target_lang: string
}

export interface TranslateResponse {
  code: number
  data: string
  id?: number
  source_lang?: string
  target_lang?: string
  alternatives?: string[]
  method?: string
  provider?: string
  failover?: boolean
}

export type Theme = 'light' | 'dark' | 'system'

export interface Settings {
  apiEndpoint: string
  token: string
  autoTranslate: boolean
  autoTranslateDelay: number
  theme: Theme
}

const DEFAULT_SETTINGS: Settings = {
  apiEndpoint: '',
  token: '',
  autoTranslate: true,
  autoTranslateDelay: 500,
  theme: 'system',
}

const SETTINGS_KEY = 'deeplx-settings'

export function getSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return DEFAULT_SETTINGS
}

export function saveSettings(settings: Partial<Settings>): void {
  try {
    const current = getSettings()
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

export async function translate(
  text: string,
  targetLang: string,
  sourceLang = 'auto',
  signal?: AbortSignal
): Promise<TranslateResponse> {
  const settings = getSettings()
  const baseUrl = settings.apiEndpoint || window.location.origin

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (settings.token) {
    headers['Authorization'] = `Bearer ${settings.token}`
  }

  const response = await fetch(`${baseUrl}/translate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
    signal,
  })

  return response.json()
}
