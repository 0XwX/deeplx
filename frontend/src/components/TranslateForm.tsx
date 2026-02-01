import { useEffect, useCallback, useMemo } from 'react'
import { ArrowRightLeft, Copy, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useTranslate } from '@/hooks/useTranslate'
import { SOURCE_LANGUAGES, TARGET_LANGUAGES, getLanguageLabel } from '@/lib/languages'
import { useState } from 'react'
import { useI18n } from '@/i18n'

interface TranslateFormProps {
  autoTranslate: boolean
  autoTranslateDelay: number
  onTranslated?: (text: string, result: string, sourceLang: string, targetLang: string) => void
  initialText?: string
  initialSourceLang?: string
  initialTargetLang?: string
}

const MAX_TEXT_LENGTH = 5000

export function TranslateForm({
  autoTranslate,
  autoTranslateDelay,
  onTranslated,
  initialText,
  initialSourceLang,
  initialTargetLang,
}: TranslateFormProps) {
  const { t, locale } = useI18n()
  const [copied, setCopied] = useState(false)

  // Memoize language options to avoid recalculation on every render
  const sourceOptions = useMemo(() => 
    SOURCE_LANGUAGES.map(l => ({ 
      value: l.code, 
      label: getLanguageLabel(l, locale)
    })), 
    [locale]
  )
  
  const targetOptions = useMemo(() => 
    TARGET_LANGUAGES.map(l => ({ 
      value: l.code, 
      label: getLanguageLabel(l, locale)
    })),
    [locale]
  )

  const {
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
  } = useTranslate({
    autoTranslate,
    autoTranslateDelay,
  })

  // Set initial values
  useEffect(() => {
    if (initialText) setText(initialText)
    if (initialSourceLang) setSourceLang(initialSourceLang)
    if (initialTargetLang) setTargetLang(initialTargetLang)
  }, [initialText, initialSourceLang, initialTargetLang, setText, setSourceLang, setTargetLang])

  // Notify parent when translation is complete
  useEffect(() => {
    if (lastResponse && lastResponse.code === 200 && text && result) {
      onTranslated?.(text, result, sourceLang, targetLang)
    }
  }, [lastResponse, text, result, sourceLang, targetLang, onTranslated])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        translate()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [translate])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }, [result])


  return (
    <div className="flex flex-col gap-4">
      {/* Language Selector Row */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select
            options={sourceOptions}
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={swapLanguages}
          disabled={sourceLang === 'auto'}
          aria-label={t('swapLanguages')}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Select
            options={targetOptions}
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          />
        </div>
      </div>

      {/* Text Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Text */}
        <div className="relative">
          <Textarea
            placeholder={t('enterText')}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
            className="min-h-[200px] md:min-h-[300px]"
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {text.length}/{MAX_TEXT_LENGTH}
          </div>
        </div>

        {/* Result Text */}
        <div className="relative">
          <Textarea
            placeholder={t('translationResult')}
            value={result}
            readOnly
            className="min-h-[200px] md:min-h-[300px] bg-muted/30"
          />
          {result && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2"
              onClick={handleCopy}
              aria-label={copied ? t('copied') : t('copy')}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {/* Translate Button */}
      <div className="flex justify-center">
        <Button
          onClick={translate}
          disabled={isLoading || !text.trim()}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t('translating')}
            </>
          ) : (
            t('translate')
          )}
        </Button>
      </div>

      {/* Provider Info */}
      {lastResponse && lastResponse.code === 200 && (
        <div className="text-xs text-center text-muted-foreground">
          Provider: {lastResponse.provider}
          {lastResponse.failover && ' (failover)'}
          {lastResponse.method && ` · ${lastResponse.method}`}
        </div>
      )}
    </div>
  )
}
