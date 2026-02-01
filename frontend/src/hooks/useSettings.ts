import { useState, useCallback } from 'react'
import { type Settings, getSettings, saveSettings } from '@/lib/api'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(getSettings)

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates }
      saveSettings(newSettings)
      return newSettings
    })
  }, [])

  return { settings, updateSettings }
}
