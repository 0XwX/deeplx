import { useState, useEffect, useCallback, useMemo } from 'react'
import { Settings, History, Sun, Moon, Zap, Shield, DollarSign, Code2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TranslateForm } from '@/components/TranslateForm'
import { SettingsPanel } from '@/components/SettingsPanel'
import { HistoryPanel } from '@/components/HistoryPanel'
import { GridDecoration } from '@/components/GridDecoration'
import { BorderBeam } from '@/components/ui/border-beam'
import { useSettings } from '@/hooks/useSettings'
import { useHistory, type HistoryItem } from '@/hooks/useHistory'
import { useTheme } from '@/hooks/useTheme'
import { useI18n } from '@/i18n'

// Static features data - defined outside component to avoid re-creation
const FEATURES_DATA = [
  { icon: DollarSign, titleKey: 'free', descKey: 'freeDesc' },
  { icon: Zap, titleKey: 'fast', descKey: 'fastDesc' },
  { icon: Shield, titleKey: 'secure', descKey: 'secureDesc' },
  { icon: Code2, titleKey: 'simple', descKey: 'simpleDesc' },
] as const

// Pre-generate random delays for BorderBeam to avoid Math.random() in render
const BEAM_DELAYS = [0, 1, 2, 3]

function App() {
  const { t, locale, toggleLocale } = useI18n()
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null)

  const { settings, updateSettings } = useSettings()
  const { history, addHistory, clearHistory, removeHistoryItem } = useHistory()
  const { theme, toggleTheme } = useTheme(settings, updateSettings)

  // Rebuild features when locale changes
  const features = useMemo(() =>
    FEATURES_DATA.map(({ icon, titleKey, descKey }) => ({
      icon,
      title: t(titleKey),
      description: t(descKey),
    })),
    [locale, t]
  )

  // Handle translation complete - add to history
  const handleTranslated = useCallback((
    text: string,
    result: string,
    sourceLang: string,
    targetLang: string
  ) => {
    addHistory({ text, result, sourceLang, targetLang })
  }, [addHistory])

  // Handle history item selection
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setSelectedHistory(item)
    setShowHistory(false)
  }, [])

  // Clear selected history after it's used
  useEffect(() => {
    if (selectedHistory) {
      const timer = setTimeout(() => setSelectedHistory(null), 100)
      return () => clearTimeout(timer)
    }
  }, [selectedHistory])

  // Escape key to close panels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false)
        setShowHistory(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Memoized callbacks for panels
  const handleCloseSettings = useCallback(() => setShowSettings(false), [])
  const handleCloseHistory = useCallback(() => setShowHistory(false), [])
  const handleOpenHistory = useCallback(() => setShowHistory(true), [])
  const handleOpenSettings = useCallback(() => setShowSettings(true), [])

  return (
    <div className="min-h-screen">
      <GridDecoration />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="DeepLX" className="h-7 w-7 dark:invert" />
            <span className="text-xl font-bold">DeepLX</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLocale}
              aria-label={locale === 'en' ? '切换到中文' : 'Switch to English'}
            >
              <span className="text-sm font-medium">{locale === 'en' ? '中' : 'EN'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenHistory}
              aria-label={t('history')}
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenSettings}
              aria-label={t('settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <a
              href="https://github.com/0XwX/deeplx"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t('heroBadge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#translate">
              <Button size="lg" className="gap-2">
                {t('startTranslating')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#api">
              <Button variant="outline" size="lg">
                API {t('apiDocs')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative group rounded-xl border border-border bg-card p-6 hover:border-foreground/20 transition-colors overflow-hidden"
            >
              <BorderBeam size={120} duration={8} delay={BEAM_DELAYS[index]} />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Translate Section */}
      <section id="translate" className="py-12 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {t('onlineTranslation')}
            </h2>
            <p className="text-muted-foreground">
              {t('enterTextHint')}
            </p>
          </div>
          <TranslateForm
            autoTranslate={settings.autoTranslate}
            autoTranslateDelay={settings.autoTranslateDelay}
            onTranslated={handleTranslated}
            onUnauthorized={handleOpenSettings}
            initialText={selectedHistory?.text}
            initialSourceLang={selectedHistory?.sourceLang}
            initialTargetLang={selectedHistory?.targetLang}
          />
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-12 px-4 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              API {t('apiUsage')}
            </h2>
            <p className="text-muted-foreground">
              {t('apiUsageDesc')}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-600 dark:text-green-400">POST</span>
              <code className="text-sm text-muted-foreground">/translate</code>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-foreground">{`curl -X POST ${window.location.origin}/translate \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Hello, World!",
    "source_lang": "auto",
    "target_lang": "ZH"
  }'`}</code>
            </pre>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">Response</span>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-foreground">{`{
  "code": 200,
  "data": "Hello, World!",
  "source_lang": "EN",
  "target_lang": "ZH",
  "provider": "deepl"
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80 backdrop-blur mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <img src="/logo.svg" alt="DeepLX" className="h-5 w-5 dark:invert opacity-60" />
            <span>{t('poweredBy')}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://github.com/0XwX/deeplx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/OwO-Network/DeepLX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('website')}
            </a>
          </div>
        </div>
      </footer>

      {/* Panels */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={handleCloseSettings}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <HistoryPanel
        isOpen={showHistory}
        onClose={handleCloseHistory}
        history={history}
        onClearHistory={clearHistory}
        onRemoveItem={removeHistoryItem}
        onSelectItem={handleSelectHistory}
      />
    </div>
  )
}

export default App
