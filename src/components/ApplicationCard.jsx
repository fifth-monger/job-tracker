import { StatusBadge } from './StatusBadge'
import './ApplicationCard.css'

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
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
  'Dead End': 'dead-end',
}

export function ApplicationCard({
  application,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  archived = false,
}) {
  const { company, role, status, date_applied, source, notes } = application
  const statusSlug = STATUS_SLUG[status] || status.toLowerCase()

  async function handleDelete() {
    if (window.confirm(`Remove ${company} — ${role}?`)) {
      await onDelete(application.id)
    }
  }

  async function handleArchive(e) {
    e.stopPropagation()
    await onArchive?.(application.id)
  }

  async function handleUnarchive(e) {
    e.stopPropagation()
    await onUnarchive?.(application.id)
  }

  return (
    <article
      className={`app-card app-card--${statusSlug}${archived ? ' app-card--archived' : ''}`}
      onClick={() => onEdit?.(application)}
      role={onEdit ? 'button' : undefined}
      tabIndex={onEdit ? 0 : undefined}
      onKeyDown={(e) => onEdit && e.key === 'Enter' && onEdit(application)}
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
            {formatDate(date_applied)}
          </time>
          {source && <span className="app-card__source">via {source}</span>}
          {notes && (
            <span className="app-card__notes" aria-label="Has notes">Notes</span>
          )}
        </footer>
      </div>

      <div className="app-card__actions">
        {archived ? (
          onUnarchive && (
            <button
              type="button"
              className="app-card__action app-card__action--restore"
              onClick={handleUnarchive}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={`Restore ${company} application`}
              title="Restore"
            >
              Restore
            </button>
          )
        ) : (
          onArchive && (
            <button
              type="button"
              className="app-card__action app-card__action--archive"
              onClick={handleArchive}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={`Archive ${company} application`}
              title="Archive"
            >
              Archive
            </button>
          )
        )}
        {onDelete && (
          <button
            type="button"
            className="app-card__action app-card__action--delete"
            onClick={(e) => { e.stopPropagation(); handleDelete() }}
            onKeyDown={(e) => e.stopPropagation()}
            aria-label={`Delete ${company} application`}
            title="Delete"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </article>
  )
}
