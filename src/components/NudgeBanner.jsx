import { useState } from 'react'
import './NudgeBanner.css'

export function NudgeBanner({ nudge, onDismiss }) {
  const [dismissing, setDismissing] = useState(false)

  function handleDismiss() {
    setDismissing(true)
    setTimeout(() => onDismiss(nudge.key), 150)
  }

  return (
    <div className={`nudge-banner${dismissing ? ' nudge-banner--dismissing' : ''}`}>
      <span className="nudge-banner__icon" aria-hidden="true">⚑</span>
      <p className="nudge-banner__message">{nudge.message}</p>
      <button
        className="nudge-banner__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss nudge"
      >
        ×
      </button>
    </div>
  )
}
