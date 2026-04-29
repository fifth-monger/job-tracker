import { ApplicationCard } from './ApplicationCard'
import './ApplicationList.css'

export function ApplicationList({ applications, sortBy, onSortChange, onEdit, onDelete }) {
  return (
    <div className="app-list-wrapper">
      <div className="app-list__controls">
        <label htmlFor="sort-select" className="app-list__sort-label">Sort by</label>
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

      {applications.length === 0 ? (
        <div className="app-list__empty">
          <p className="app-list__empty-text">No applications yet.</p>
          <p className="app-list__empty-sub">Hit + Add to log your first one.</p>
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
