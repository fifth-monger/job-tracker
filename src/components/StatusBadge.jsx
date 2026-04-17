import './StatusBadge.css'

export function StatusBadge({ status }) {
  const slug = status.toLowerCase().replace(/\s+/g, '-')
  return (
    <span className={`status-badge status-badge--${slug}`}>
      {status}
    </span>
  )
}
