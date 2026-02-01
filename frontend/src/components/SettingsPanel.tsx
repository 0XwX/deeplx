import { X, Sun, Moon, Monitor, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import type { Settings, Theme } from '@/lib/api'
import { useI18n } from '@/i18n'

// Hoist static array outside component to avoid re-creation on every render
const themeOptions = [
  { value: 'light', icon: Sun, labelKey: 'light' },
  { value: 'dark', icon: Moon, labelKey: 'dark' },
  { value: 'system', icon: Monitor, labelKey: 'system' },
] as const

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onUpdateSettings: (updates: Partial<Settings>) => void
}

export function SettingsPanel({ isOpen, onClose, settings, onUpdateSettings }: SettingsPanelProps) {
  const { t, locale, toggleLocale } = useI18n()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">{t('settings')}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Language Switch */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('language')}</label>
              <div className="flex gap-2">
                <Button
                  variant={locale === 'zh' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleLocale()}
                >
                  <Languages className="h-4 w-4 mr-1" />
                  {locale === 'zh' ? 'English' : '中文'}
                </Button>
              </div>
            </div>

            {/* API Endpoint */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('apiEndpoint')}</label>
              <Input
                placeholder={t('apiEndpointPlaceholder')}
                value={settings.apiEndpoint}
                onChange={(e) => onUpdateSettings({ apiEndpoint: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {t('apiEndpointDesc')}
              </p>
            </div>

            {/* API Token */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('apiToken')}</label>
              <Input
                type="password"
                placeholder={t('apiTokenPlaceholder')}
                value={settings.token}
                onChange={(e) => onUpdateSettings({ token: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {t('apiTokenDesc')}
              </p>
            </div>

            {/* Auto Translate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t('autoTranslate')}
                </label>
                <Switch
                  checked={settings.autoTranslate}
                  onChange={(e) => onUpdateSettings({ autoTranslate: e.target.checked })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('autoTranslateDesc')}
              </p>
            </div>

            {/* Auto Translate Delay */}
            {settings.autoTranslate ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('autoTranslateDelay')}
                </label>
                <Slider
                  min={100}
                  max={2000}
                  step={100}
                  value={settings.autoTranslateDelay}
                  showValue
                  onChange={(e) => onUpdateSettings({ autoTranslateDelay: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  {t('autoTranslateDelayDesc')}
                </p>
              </div>
            ) : null}

            {/* Theme */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('theme')}</label>
              <div className="flex gap-2">
                {themeOptions.map(({ value, icon: Icon, labelKey }) => (
                  <Button
                    key={value}
                    variant={settings.theme === value ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => onUpdateSettings({ theme: value as Theme })}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {t(labelKey)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('themeDesc')}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {t('shortcuts')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
