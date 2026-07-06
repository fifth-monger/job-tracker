import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'job-tracker-theme'
export const THEMES = { DAY: 'day', EVENING: 'evening' }

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === THEMES.DAY || stored === THEMES.EVENING) return stored
  } catch {
    /* private browsing */
  }
  return THEMES.DAY
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* private browsing */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === THEMES.DAY ? THEMES.EVENING : THEMES.DAY))
  }, [])

  const isEvening = theme === THEMES.EVENING

  return { theme, toggle, isEvening }
}
