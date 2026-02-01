import { useState, useCallback, useEffect } from 'react'

export interface HistoryItem {
  id: string
  text: string
  result: string
  sourceLang: string
  targetLang: string
  timestamp: number
}

const HISTORY_KEY = 'deeplx-history'
const MAX_HISTORY_ITEMS = 50

function loadHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
  return []
}

function saveHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save history:', e)
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory)

  useEffect(() => {
    saveHistory(history)
  }, [history])

  const addHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).slice(2, 10),
      timestamp: Date.now(),
    }
    setHistory(prev => [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const removeHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }, [])

  return { history, addHistory, clearHistory, removeHistoryItem }
}
