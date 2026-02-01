import { useEffect, useCallback } from 'react'
import type { Theme, Settings } from '@/lib/api'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolved = theme === 'system' ? getSystemTheme() : theme

  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// 使用 View Transition API 切换主题（带动画）
function applyThemeWithTransition(theme: Theme) {
  // 检查浏览器是否支持 View Transition API
  if (!document.startViewTransition) {
    applyTheme(theme)
    return
  }

  document.startViewTransition(() => {
    applyTheme(theme)
  })
}

export function useTheme(settings: Settings, updateSettings: (updates: Partial<Settings>) => void) {
  const theme = settings.theme

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Listen for system theme changes when using 'system' mode
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    updateSettings({ theme: newTheme })
  }, [updateSettings])

  const toggleTheme = useCallback(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    const newTheme = resolved === 'dark' ? 'light' : 'dark'

    // 使用 View Transition 动画切换
    applyThemeWithTransition(newTheme)
    updateSettings({ theme: newTheme })
  }, [theme, updateSettings])

  return { theme, setTheme, toggleTheme }
}
