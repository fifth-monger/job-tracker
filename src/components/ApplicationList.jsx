import { ApplicationCard } from './ApplicationCard'
import './ApplicationList.css'

export function ApplicationList({ applications, sortBy, onSortChange, onEdit, onDelete, onAdd }) {
  return (
    <div className="app-list-wrapper">
      <header className="app-list__header">
        <div className="app-list__heading">
          <p className="app-list__kicker kicker only-day">The ledger</p>
          <h2 className="app-list__title">
            <span className="only-day">Applications</span>
            <span className="only-evening only-evening--inline">applications</span>
          </h2>
        </div>
        <div className="app-list__controls">
          <label htmlFor="sort-select" className="app-list__sort-label">
            <span className="only-day">Sort</span>
            <span className="only-evening only-evening--inline">Sort by</span>
          </label>
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
          <div className="app-list__empty-sun only-day" aria-hidden="true" />
          <p className="app-list__empty-text only-day">Your ledger awaits.</p>
          <p className="app-list__empty-sub only-day">
            When a role catches your eye,{' '}
            <button type="button" className="app-list__empty-link" onClick={onAdd}>
              log your first application
            </button>
            .
          </p>
          <p className="app-list__empty-text only-evening only-evening--block">No applications yet.</p>
          <p className="app-list__empty-sub only-evening only-evening--block">
            Hit + Add to log your first one.
          </p>
        </div>
      ) : (
        <ul className="app-list" aria-label="Job applications">
          {applications.map((app) => (
            <li key={app.id} className="app-list__item">
              <ApplicationCard
                application={app}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
