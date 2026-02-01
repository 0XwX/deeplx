export const SUPPORTED_LANGUAGES = [
  { code: 'BG', language: 'Bulgarian' },
  { code: 'ZH', language: 'Chinese' },
  { code: 'CS', language: 'Czech' },
  { code: 'DA', language: 'Danish' },
  { code: 'NL', language: 'Dutch' },
  { code: 'EN', language: 'English' },
  { code: 'ET', language: 'Estonian' },
  { code: 'FI', language: 'Finnish' },
  { code: 'FR', language: 'French' },
  { code: 'DE', language: 'German' },
  { code: 'EL', language: 'Greek' },
  { code: 'HU', language: 'Hungarian' },
  { code: 'IT', language: 'Italian' },
  { code: 'JA', language: 'Japanese' },
  { code: 'LV', language: 'Latvian' },
  { code: 'LT', language: 'Lithuanian' },
  { code: 'PL', language: 'Polish' },
  { code: 'PT', language: 'Portuguese' },
  { code: 'RO', language: 'Romanian' },
  { code: 'RU', language: 'Russian' },
  { code: 'SK', language: 'Slovak' },
  { code: 'SL', language: 'Slovenian' },
  { code: 'ES', language: 'Spanish' },
  { code: 'SV', language: 'Swedish' },
  { code: 'TR', language: 'Turkish' },
  { code: 'ID', language: 'Indonesian' },
  { code: 'UK', language: 'Ukrainian' },
]

export const FORMALITY_TONES = new Set(['formal', 'informal', 'undefined'])

export const API_URL = 'https://www2.deepl.com/jsonrpc'

export const HTTP_STATUS_OK = 200
export const HTTP_STATUS_BAD_REQUEST = 400
export const HTTP_STATUS_UNAUTHORIZED = 401
export const HTTP_STATUS_NOT_FOUND = 404
export const HTTP_STATUS_NOT_ALLOWED = 405
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429
export const HTTP_STATUS_INTERNAL_ERROR = 500
export const HTTP_STATUS_SERVICE_UNAVAILABLE = 503

// Browser-emulated request headers, synced from OwO-Network/DeepLX latest version
export const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  Origin: 'https://www.deepl.com',
  Referer: 'https://www.deepl.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0',
}
