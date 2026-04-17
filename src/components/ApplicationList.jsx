import { ApplicationCard } from './ApplicationCard'
import './ApplicationList.css'

export function ApplicationList({ applications, onEdit, onDelete }) {
  if (applications.length === 0) {
    return (
      <div className="app-list__empty">
        <p className="app-list__empty-text">No applications yet.</p>
        <p className="app-list__empty-sub">Hit + Add to log your first one.</p>
      </div>
    )
  }

  return (
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
  )
}
