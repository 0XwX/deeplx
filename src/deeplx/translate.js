import {
  API_URL,
  COMMON_HEADERS,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from './constants.js'
import {
  abbreviateLanguage,
  formatPostString,
  getICount,
  getRandomNumber,
  getTimeStamp,
} from './utils.js'

const REQUEST_ALTERNATIVES = 3

const makeRequest = async (postData, dlSession, signal) => {
  const headers = dlSession
    ? { ...COMMON_HEADERS, Cookie: `dl_session=${dlSession}` }
    : COMMON_HEADERS
  const res = await fetch(API_URL, {
    method: 'POST',
    body: formatPostString(postData),
    headers,
    signal,
  })

  // Check 429 status code (IP temporarily blocked)
  if (res.status === HTTP_STATUS_TOO_MANY_REQUESTS) {
    throw new Error(
      "Too many requests, your IP has been blocked by DeepL temporarily, please don't request it frequently in a short time",
    )
  }

  // Check other non-200 status codes
  if (!res.ok) {
    throw new Error(`Request failed with status code: ${res.status}`)
  }

  return res.json()
}

export const translateByDeepLX = async (sourceLang, targetLang, text, dlSession, signal) => {
  if (!text) {
    return { code: HTTP_STATUS_NOT_FOUND, message: 'No text to translate' }
  }

  // Normalize language codes
  let sourceLangCode = 'auto'
  if (sourceLang && sourceLang !== 'auto') {
    sourceLangCode = abbreviateLanguage(sourceLang) ?? sourceLang.toUpperCase()
  }

  const targetLangCode = abbreviateLanguage(targetLang) ?? targetLang.toUpperCase()

  const id = getRandomNumber()
  const iCount = getICount(text)
  const timestamp = getTimeStamp(iCount)

  // Use LMT_handle_texts method (consistent with xixu/OwO-Network)
  const postData = {
    jsonrpc: '2.0',
    method: 'LMT_handle_texts',
    id,
    params: {
      splitting: 'newlines',
      lang: {
        source_lang_user_selected: sourceLangCode,
        target_lang: targetLangCode,
      },
      texts: [{ text, requestAlternatives: REQUEST_ALTERNATIVES }],
      timestamp,
    },
  }

  let result
  try {
    const response = await makeRequest(postData, dlSession, signal)
    result = response.result

    if (!result?.texts?.length) {
      return {
        code: HTTP_STATUS_SERVICE_UNAVAILABLE,
        message: 'Translation failed: empty response',
      }
    }
  } catch (error) {
    console.error('DeepL request failed:', error)
    return {
      code: HTTP_STATUS_SERVICE_UNAVAILABLE,
      message: 'Failed to communicate with DeepL API',
    }
  }

  // Get main translation result
  const mainText = result.texts[0]?.text
  if (!mainText) {
    return {
      code: HTTP_STATUS_SERVICE_UNAVAILABLE,
      message: 'Translation failed: no text in response',
    }
  }

  // Get alternative translations
  const alternatives = (result.texts[0]?.alternatives || []).map((alt) => alt?.text).filter(Boolean)

  // Get detected source language from response
  const detectedLang = result.lang || sourceLangCode

  return {
    code: HTTP_STATUS_OK,
    id,
    data: mainText,
    alternatives,
    sourceLang: detectedLang.toUpperCase(),
    targetLang: targetLangCode.toUpperCase(),
    method: dlSession ? 'Pro' : 'Free',
  }
}
