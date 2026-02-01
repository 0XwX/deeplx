import { SUPPORTED_LANGUAGES } from './constants.js'

/**
 * Parse request body JSON
 * EdgeOne platform incorrectly escapes certain special characters (like !) to \!
 * This function fixes invalid escapes before parsing JSON
 * @param {Request} request - HTTP request object
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function parseRequestBody(request) {
  try {
    let rawText = await request.text()
    // Remove invalid escapes, keeping only valid JSON escape characters: " \ / b f n r t u
    // Example: {"text":"Hello\!"} → {"text":"Hello!"}
    rawText = rawText.replace(/\\([^"\\/bfnrtu])/g, '$1')
    return { success: true, data: JSON.parse(rawText) }
  } catch (err) {
    console.error('Failed to parse request JSON:', err)
    return { success: false, error: 'Invalid JSON' }
  }
}

/**
 * The following functions simulate DeepL official client behavior for generating legitimate-looking requests.
 * These are part of DeepL's anti-scraping mechanism; modifications may result in request rejection.
 */

/**
 * Count the number of letter 'i' in the text
 * DeepL uses this value to generate content-based timestamps
 */
export const getICount = (translateText) => {
  return (translateText.match(/i/g) || []).length
}

/**
 * Generate DeepL-format request ID
 * ID range is approximately 100,000,000 - 199,999,000
 * Synced from OwO-Network/DeepLX latest version
 */
export const getRandomNumber = () => {
  const base = Math.floor(Math.random() * 99_999) + 100_000
  return base * 1000
}

/**
 * Adjust timestamp based on the count of 'i' in the text
 * This is one of DeepL client's fingerprint characteristics
 */
export const getTimeStamp = (iCount) => {
  const ts = Date.now()
  if (iCount !== 0) {
    const adjustedCount = iCount + 1
    return ts - (ts % adjustedCount) + adjustedCount
  }
  return ts
}

/**
 * Format JSON-RPC request string
 * DeepL client adds different numbers of spaces after the "method" key based on request ID
 * This is part of anti-scraping detection and must be precisely simulated
 */
export const formatPostString = (postData) => {
  const postStr = JSON.stringify(postData)
  const shouldAddSpace = (postData.id + 5) % 29 === 0 || (postData.id + 3) % 13 === 0
  return postStr.replaceAll('"method":"', shouldAddSpace ? `"method" : "` : `"method": "`)
}

let abbreviateLanguageDictionary

function getAbbreviateLanguages() {
  return (abbreviateLanguageDictionary ??= SUPPORTED_LANGUAGES.reduce((acc, lang) => {
    acc[lang.code.toLowerCase()] = lang.code
    acc[lang.language.toLowerCase()] = lang.code
    return acc
  }, {}))
}

export function abbreviateLanguage(language) {
  return getAbbreviateLanguages()[language.split('-')[0].toLowerCase()]
}
