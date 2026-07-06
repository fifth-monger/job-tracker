import './ThemeToggle.css'

export function ThemeToggle({ isEvening, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isEvening ? 'Switch to day mode' : 'Switch to evening mode'}
      title={isEvening ? 'Day mode' : 'Evening mode'}
    >
      <span className="theme-toggle__icon theme-toggle__icon--day" aria-hidden="true">☀</span>
      <span className="theme-toggle__icon theme-toggle__icon--evening" aria-hidden="true">▮</span>
    </button>
  )
}
