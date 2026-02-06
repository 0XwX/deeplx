import { useState, useCallback, useRef, useEffect } from 'react'
import { translate as apiTranslate, type TranslateResponse } from '@/lib/api'
import { useI18n } from '@/i18n'
import { toast } from 'sonner'

interface UseTranslateOptions {
  autoTranslate?: boolean
  autoTranslateDelay?: number
  onTranslated?: (result: TranslateResponse) => void
  onUnauthorized?: () => void
}

export function useTranslate(options: UseTranslateOptions = {}) {
  const { autoTranslate = true, autoTranslateDelay = 500, onTranslated, onUnauthorized } = options
  const { t } = useI18n()

  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('ZH')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<TranslateResponse | null>(null)

  const autoTranslateTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const translate = useCallback(async () => {
    if (!text.trim()) {
      setResult('')
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiTranslate(text, targetLang, sourceLang)

      if (response.code === 200) {
        setResult(response.data)
        setLastResponse(response)
        onTranslated?.(response)
      } else if (response.code === 401) {
        const errorMsg = t('unauthorizedError')
        setError(errorMsg)
        setResult('')
        toast.error(errorMsg)
        onUnauthorized?.()
      } else {
        setError(response.data || t('translationFailed'))
        setResult('')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('networkError'))
      setResult('')
    } finally {
      setIsLoading(false)
    }
  }, [text, sourceLang, targetLang, onTranslated, onUnauthorized, t])

  // Auto translate with debounce
  useEffect(() => {
    if (!autoTranslate || !text.trim()) {
      return
    }

    if (autoTranslateTimer.current) {
      clearTimeout(autoTranslateTimer.current)
    }

    autoTranslateTimer.current = setTimeout(() => {
      translate()
    }, autoTranslateDelay)

    return () => {
      if (autoTranslateTimer.current) {
        clearTimeout(autoTranslateTimer.current)
      }
    }
  }, [text, autoTranslate, autoTranslateDelay, translate])

  const swapLanguages = useCallback(() => {
    if (sourceLang === 'auto') return

    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setText(result)
    setResult(text)
  }, [sourceLang, targetLang, text, result])

  const clear = useCallback(() => {
    setText('')
    setResult('')
    setError(null)
    setLastResponse(null)
  }, [])

  return {
    text,
    setText,
    result,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    isLoading,
    error,
    lastResponse,
    translate,
    swapLanguages,
    clear,
  }
}
