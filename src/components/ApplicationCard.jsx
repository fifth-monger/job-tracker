import { StatusBadge } from './StatusBadge'
import './ApplicationCard.css'

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ApplicationCard({ application, onEdit, onDelete }) {
  const { company, role, status, date_applied, source, notes } = application

  function handleDelete() {
    if (window.confirm(`Remove ${company} — ${role}?`)) {
      onDelete(application.id)
    }
  }

  return (
    <div className="app-card" onClick={() => onEdit(application)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onEdit(application)}>
      <div className="app-card__main">
        <div className="app-card__identity">
          <span className="app-card__company">{company}</span>
          <span className="app-card__role">{role}</span>
        </div>
        <div className="app-card__meta">
          <span className="app-card__date">{formatDate(date_applied)}</span>
          {source && <span className="app-card__source">{source}</span>}
          {notes && <span className="app-card__notes-icon" aria-label="Has notes">✎</span>}
        </div>
      </div>
      <div className="app-card__right">
        <StatusBadge status={status} />
        <button
          className="app-card__delete"
          onClick={(e) => { e.stopPropagation(); handleDelete() }}
          aria-label={`Delete ${company} application`}
        >
          ×
        </button>
      </div>
    </div>
  )
}
