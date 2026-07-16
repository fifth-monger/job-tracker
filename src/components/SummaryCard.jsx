import { SUMMARY_STATUS_ROWS } from '../lib/constants'
import './SummaryCard.css'

export function SummaryCard({ applications }) {
  const counts = SUMMARY_STATUS_ROWS.reduce((acc, row) => {
    acc[row.key] = applications.filter((a) => row.statuses.includes(a.status)).length
    return acc
  }, {})

  const lastUpdated = applications.length
    ? new Date(
        Math.max(...applications.map((a) => new Date(a.updated_at)))
      ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <article className="summary-card">
      <header className="summary-card__header">
        <p className="summary-card__kicker kicker">At a glance</p>
        <div className="summary-card__total-wrap">
          <span className="summary-card__total">{applications.length}</span>
          <span className="summary-card__total-label">
            {applications.length === 1 ? 'application' : 'applications'}
          </span>
        </div>
      </header>

      <dl className="summary-card__statuses">
        {SUMMARY_STATUS_ROWS.map((row) => (
          <div key={row.key} className="summary-card__status-row">
            <dt className="summary-card__status-label">
              <span
                className="summary-card__status-dot"
                style={{ '--dot-color': `var(--color-status-${row.colorVar})` }}
                aria-hidden="true"
              />
              {row.label}
            </dt>
            <dd className="summary-card__status-count">{counts[row.key]}</dd>
          </div>
        ))}
      </dl>

      {lastUpdated && (
        <footer className="summary-card__footer">
          <span className="summary-card__last-updated">Last activity · {lastUpdated}</span>
        </footer>
      )}
    </article>
  )
}
