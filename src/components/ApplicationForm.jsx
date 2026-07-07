import { useState, useEffect } from 'react'
import { STATUSES, emptyForm } from '../lib/constants'
import './ApplicationForm.css'

function formFromInitial(initial) {
  if (!initial) return emptyForm()
  return {
    ...emptyForm(),
    ...initial,
    salary_range: initial.salary_range ?? '',
    contact: initial.contact ?? '',
    source: initial.source ?? '',
    notes: initial.notes ?? '',
  }
}

export function ApplicationForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => formFromInitial(initial))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setForm(formFromInitial(initial))
  }, [initial])

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const isEdit = Boolean(initial?.id)

  return (
    <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="form-modal" role="dialog" aria-modal="true"
        aria-label={isEdit ? 'Edit application' : 'Add application'}>
        <div className="form-modal__header">
          <h2 className="form-modal__title">{isEdit ? 'Edit entry' : 'New entry'}</h2>
          <button className="form-modal__close" onClick={onClose} aria-label="Close form">×</button>
        </div>

        <form onSubmit={handleSubmit} className="form-modal__body">
          <div className="form-group form-group--required">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => set('company', e.target.value)}
              required
              autoFocus
              placeholder="Acme Corp"
            />
          </div>

          <div className="form-group form-group--required">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              type="text"
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              required
              placeholder="Software Engineer"
            />
          </div>

          <div className="form-row">
            <div className="form-group form-group--required">
              <label htmlFor="date_applied">Date Applied</label>
              <input
                id="date_applied"
                type="date"
                value={form.date_applied}
                onChange={(e) => set('date_applied', e.target.value)}
                required
              />
            </div>

            <div className="form-group form-group--required">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                required
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-divider" aria-hidden="true" />

          <div className="form-group">
            <label htmlFor="salary_range">Salary Range</label>
            <input
              id="salary_range"
              type="text"
              value={form.salary_range}
              onChange={(e) => set('salary_range', e.target.value)}
              placeholder="$80k–$100k"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              type="text"
              value={form.contact}
              onChange={(e) => set('contact', e.target.value)}
              placeholder="Recruiter name or email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="source">Source</label>
            <input
              id="source"
              type="text"
              value={form.source}
              onChange={(e) => set('source', e.target.value)}
              placeholder="LinkedIn, referral, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={4}
              placeholder="Anything worth remembering…"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Log application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
