import { X, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { HistoryItem } from '@/hooks/useHistory'
import { useI18n } from '@/i18n'

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onClearHistory: () => void
  onRemoveItem: (id: string) => void
  onSelectItem: (item: HistoryItem) => void
}

// Move formatTime outside component to avoid re-creation on every render
function formatTime(timestamp: number, locale: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - timestamp

  if (locale === 'en') {
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else {
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}

export function HistoryPanel({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRemoveItem,
  onSelectItem,
}: HistoryPanelProps) {
  const { t, locale } = useI18n()

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
            <h2 className="text-lg font-semibold">{t('history')}</h2>
            <div className="flex items-center gap-2">
              {history.length > 0 ? (
                <Button variant="ghost" size="sm" onClick={onClearHistory}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('clearHistory')}
                </Button>
              ) : null}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Clock className="h-12 w-12 mb-4 opacity-50" />
                <p>{t('noHistory')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-accent/50 cursor-pointer group"
                    onClick={() => onSelectItem(item)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.text}</p>
                        <p className="text-sm text-muted-foreground truncate mt-1">{item.result}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{item.sourceLang} → {item.targetLang}</span>
                          <span>·</span>
                          <span>{formatTime(item.timestamp, locale)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveItem(item.id)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
