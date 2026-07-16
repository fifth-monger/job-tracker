import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { isConfigured, supabase } from '../lib/supabase'
import { STATUSES, isArchived } from '../lib/constants'
import { ApplicationList } from '../components/ApplicationList'
import { ApplicationForm } from '../components/ApplicationForm'
import { ThemeToggle } from '../components/ThemeToggle'
import './Dashboard.css'
import './Archived.css'

export function Archived({
  applications,
  loading,
  error,
  update,
  remove,
  unarchive,
  onViewActive,
}) {
  const archivedApplications = applications.filter(isArchived)
  const { toggle, isEvening } = useTheme()
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [sortBy, setSortBy] = useState('date')
  const [actionError, setActionError] = useState(null)

  const sortedApplications = [...archivedApplications].sort((a, b) => {
    if (sortBy === 'company') return a.company.localeCompare(b.company)
    if (sortBy === 'status') return STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status)
    return new Date(b.date_applied) - new Date(a.date_applied)
  })

  function openEdit(application) {
    setEditTarget(application)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  async function handleSave(fields) {
    const { id, created_at, updated_at, ...rest } = fields
    if (editTarget?.id) {
      await update(editTarget.id, rest)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  async function handleDelete(id) {
    setActionError(null)
    try {
      await remove(id)
    } catch (err) {
      setActionError(err.message)
    }
  }

  async function handleUnarchive(id) {
    setActionError(null)
    try {
      await unarchive(id)
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="dashboard archived-page">
      <div className="dashboard__atmosphere" aria-hidden="true">
        <div className="dashboard__sun" />
        <div className="dashboard__leaf dashboard__leaf--1" />
        <div className="dashboard__leaf dashboard__leaf--2" />
      </div>

      <header className="dashboard__masthead">
        <div className="dashboard__masthead-inner">
          <div className="dashboard__masthead-text">
            <p className="dashboard__kicker">Set aside for later</p>
            <h1 className="dashboard__title">
              Archived <em>applications</em>
            </h1>
            <p className="dashboard__tagline">
              Rejected roles and quiet threads you cleared from the main ledger.
            </p>
          </div>
          <div className="dashboard__actions">
            <ThemeToggle isEvening={isEvening} onToggle={toggle} />
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onViewActive}
            >
              Back to applications
            </button>
            <button className="btn btn--ghost dashboard__signout-btn" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
        <div className="dashboard__rule" aria-hidden="true" />
      </header>

      <main className="dashboard__main">
        {!isConfigured && (
          <div className="dashboard__setup" role="alert">
            <p className="dashboard__setup-title">Supabase not configured</p>
            <p className="dashboard__setup-body">
              Copy <code>.env.local.example</code> to <code>.env.local</code> and add your Supabase project URL and anon key, then restart the dev server.
            </p>
          </div>
        )}

        {error && (
          <div className="dashboard__error" role="alert">
            Failed to load: {error}
          </div>
        )}

        {actionError && (
          <div className="dashboard__error" role="alert">
            {actionError}
          </div>
        )}

        <section className="archived-page__content" aria-label="Archived applications">
          {loading ? (
            <p className="dashboard__loading">Gathering archived entries…</p>
          ) : (
            <ApplicationList
              applications={sortedApplications}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onEdit={openEdit}
              onDelete={handleDelete}
              onUnarchive={handleUnarchive}
              archived
              title="Archive"
              kicker="Out of the main view"
              emptyTitle="Nothing archived yet."
              emptyBody={
                <p className="app-list__empty-sub">
                  Applications marked Rejected are archived automatically. You can also archive any entry from the main list.
                </p>
              }
            />
          )}
        </section>
      </main>

      {formOpen && (
        <ApplicationForm
          initial={editTarget}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
