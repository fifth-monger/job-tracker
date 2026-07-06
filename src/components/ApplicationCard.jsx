import { StatusBadge } from './StatusBadge'
import './ApplicationCard.css'

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateShort(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const STATUS_SLUG = {
  Applied: 'applied',
  'Followed-Up': 'followed-up',
  Interviewing: 'interviewing',
  Offer: 'offer',
  Accepted: 'accepted',
  Rejected: 'rejected',
}

export function ApplicationCard({ application, onEdit, onDelete }) {
  const { company, role, status, date_applied, source, notes } = application
  const statusSlug = STATUS_SLUG[status] || status.toLowerCase()

  function handleDelete() {
    if (window.confirm(`Remove ${company} — ${role}?`)) {
      onDelete(application.id)
    }
  }

  return (
    <article
      className={`app-card app-card--${statusSlug}`}
      onClick={() => onEdit(application)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onEdit(application)}
    >
      <div className="app-card__accent" aria-hidden="true" />

      <div className="app-card__body">
        <header className="app-card__header">
          <div className="app-card__identity">
            <h3 className="app-card__company">{company}</h3>
            <p className="app-card__role">{role}</p>
          </div>
          <StatusBadge status={status} />
        </header>

        <footer className="app-card__meta">
          <time className="app-card__date" dateTime={date_applied}>
            <span className="only-day">{formatDate(date_applied)}</span>
            <span className="only-evening only-evening--inline">{formatDateShort(date_applied)}</span>
          </time>
          {source && (
            <span className="app-card__source">
              <span className="only-day">via {source}</span>
              <span className="only-evening only-evening--inline">{source}</span>
            </span>
          )}
          {notes && (
            <>
              <span className="app-card__notes only-day" aria-label="Has notes">Notes</span>
              <span className="app-card__notes-icon only-evening only-evening--inline" aria-label="Has notes">✎</span>
            </>
          )}
        </footer>
      </div>

      <button
        className="app-card__delete"
        onClick={(e) => { e.stopPropagation(); handleDelete() }}
        aria-label={`Delete ${company} application`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </article>
  )
}
