import './ThemeToggle.css'

export function ThemeToggle({ isEvening, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isEvening ? 'Switch to solar punk mode' : 'Switch to cyberpunk mode'}
      title={isEvening ? 'Solar punk' : 'Cyberpunk'}
    >
      <span className="theme-toggle__icon theme-toggle__icon--day" aria-hidden="true">☀</span>
      <span className="theme-toggle__icon theme-toggle__icon--cyber" aria-hidden="true">▮</span>
    </button>
  )
}
