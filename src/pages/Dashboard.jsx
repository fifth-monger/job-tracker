import { useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import { useNudges } from '../hooks/useNudges'
import { isConfigured } from '../lib/supabase'
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
      <header className="dashboard__header">
        <h1 className="dashboard__title">job tracker</h1>
        <button className="btn btn--primary dashboard__add-btn" onClick={openAdd}>
          + Add
        </button>
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

        <SummaryCard applications={applications} />

        {nudges.length > 0 && (
          <section className="dashboard__nudges" aria-label="Nudges">
            {nudges.map((nudge) => (
              <NudgeBanner key={nudge.key} nudge={nudge} onDismiss={dismiss} />
            ))}
          </section>
        )}

        {loading ? (
          <p className="dashboard__loading">Loading…</p>
        ) : (
          <ApplicationList
            applications={applications}
            onEdit={openEdit}
            onDelete={remove}
          />
        )}
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
