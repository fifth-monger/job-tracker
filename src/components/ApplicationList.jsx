import { ApplicationCard } from './ApplicationCard'
import './ApplicationList.css'

export function ApplicationList({
  applications,
  sortBy,
  onSortChange,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onAdd,
  archived = false,
  title = 'Applications',
  kicker = 'The ledger',
  emptyTitle = 'Your ledger awaits.',
  emptyBody,
}) {
  return (
    <div className="app-list-wrapper">
      <header className="app-list__header">
        <div className="app-list__heading">
          <p className="app-list__kicker kicker">{kicker}</p>
          <h2 className="app-list__title">{title}</h2>
        </div>
        <div className="app-list__controls">
          <label htmlFor="sort-select" className="app-list__sort-label">Sort</label>
          <select
            id="sort-select"
            className="app-list__sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="date">Date applied</option>
            <option value="company">Company (A–Z)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </header>

      {applications.length === 0 ? (
        <div className="app-list__empty">
          <div className="app-list__empty-sun" aria-hidden="true" />
          <p className="app-list__empty-text">{emptyTitle}</p>
          {emptyBody ?? (
            !archived && (
              <p className="app-list__empty-sub">
                When a role catches your eye,{' '}
                <button type="button" className="app-list__empty-link" onClick={onAdd}>
                  log your first application
                </button>
                .
              </p>
            )
          )}
        </div>
      ) : (
        <ul className="app-list" aria-label={archived ? 'Archived applications' : 'Job applications'}>
          {applications.map((app) => (
            <li key={app.id} className="app-list__item">
              <ApplicationCard
                application={app}
                onEdit={onEdit}
                onDelete={onDelete}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
                archived={archived}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
