import { useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import { useNudges } from '../hooks/useNudges'
import { isConfigured } from '../lib/supabase'
import { STATUSES } from '../lib/constants'
import { SummaryCard } from '../components/SummaryCard'
import { NudgeBanner } from '../components/NudgeBanner'
import { ApplicationList } from '../components/ApplicationList'
import { ApplicationForm } from '../components/ApplicationForm'
import './Dashboard.css'

export function Dashboard() {
  const { applications, loading, error, create, update, remove } = useApplications()
  const { nudges, dismiss } = useNudges(applications)
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [sortBy, setSortBy] = useState('date')

  const sortedApplications = [...applications].sort((a, b) => {
    if (sortBy === 'company') return a.company.localeCompare(b.company)
    if (sortBy === 'status') return STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status)
    return new Date(b.date_applied) - new Date(a.date_applied)
  })

  function openAdd() {
    setEditTarget(null)
    setFormOpen(true)
  }

  function openEdit(application) {
    setEditTarget(application)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  async function handleSave(fields) {
    if (editTarget?.id) {
      const { id, created_at, updated_at, ...updateFields } = fields
      await update(editTarget.id, updateFields)
    } else {
      const { id, created_at, updated_at, ...createFields } = fields
      await create(createFields)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard__atmosphere" aria-hidden="true">
        <div className="dashboard__sun" />
        <div className="dashboard__leaf dashboard__leaf--1" />
        <div className="dashboard__leaf dashboard__leaf--2" />
      </div>

      <header className="dashboard__masthead">
        <div className="dashboard__masthead-inner">
          <div className="dashboard__masthead-text">
            <p className="dashboard__kicker">Personal career log</p>
            <h1 className="dashboard__title">
              Job <em>Tracker</em>
            </h1>
            <p className="dashboard__tagline">
              A quiet ledger for roles worth reaching toward.
            </p>
          </div>
          <button className="btn btn--primary dashboard__add-btn" onClick={openAdd}>
            Log application
          </button>
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

        <div className="dashboard__layout">
          <aside className="dashboard__sidebar">
            <SummaryCard applications={applications} />

            {nudges.length > 0 && (
              <section className="dashboard__nudges" aria-label="Reminders">
                <p className="dashboard__nudges-label kicker">Reminders</p>
                {nudges.map((nudge) => (
                  <NudgeBanner key={nudge.key} nudge={nudge} onDismiss={dismiss} />
                ))}
              </section>
            )}
          </aside>

          <section className="dashboard__content" aria-label="Applications">
            {loading ? (
              <p className="dashboard__loading">Gathering your entries…</p>
            ) : (
              <ApplicationList
                applications={sortedApplications}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onEdit={openEdit}
                onDelete={remove}
                onAdd={openAdd}
              />
            )}
          </section>
        </div>
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
