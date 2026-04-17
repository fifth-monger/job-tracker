import { useState, useMemo, useCallback } from 'react'
import { computeNudges } from '../lib/nudgeLogic'

const STORAGE_KEY = 'job-tracker:dismissed-nudges'

function loadDismissed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveDismissed(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function useNudges(applications) {
  const [dismissed, setDismissed] = useState(loadDismissed)

  const nudges = useMemo(
    () => computeNudges(applications, dismissed),
    [applications, dismissed]
  )

  const dismiss = useCallback((key) => {
    setDismissed((prev) => {
      const next = new Set(prev)
      next.add(key)
      saveDismissed(next)
      return next
    })
  }, [])

  return { nudges, dismiss }
}
