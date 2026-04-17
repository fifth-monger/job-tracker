import { STATUSES } from '../lib/constants'
import './SummaryCard.css'

export function SummaryCard({ applications }) {
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length
    return acc
  }, {})

  const lastUpdated = applications.length
    ? new Date(
        Math.max(...applications.map((a) => new Date(a.updated_at)))
      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="summary-card">
      <div className="summary-card__header">
        <span className="summary-card__label">Applications</span>
        <span className="summary-card__total">{applications.length}</span>
      </div>
      <div className="summary-card__statuses">
        {STATUSES.map((s) => (
          <div key={s} className="summary-card__status-item">
            <span
              className="summary-card__status-dot"
              style={{ '--dot-color': `var(--color-status-${s.toLowerCase()})` }}
              aria-hidden="true"
            />
            <span className="summary-card__status-name">{s}</span>
            <span className="summary-card__status-count">{counts[s]}</span>
          </div>
        ))}
      </div>
      {lastUpdated && (
        <p className="summary-card__last-updated">Last activity: {lastUpdated}</p>
      )}
    </div>
  )
}
