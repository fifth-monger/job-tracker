import { useState } from 'react'
import { useSession } from './hooks/useSession'
import { useApplications } from './hooks/useApplications'
import { Login } from './components/Login'
import { Dashboard } from './pages/Dashboard'
import { Archived } from './pages/Archived'

function AuthenticatedApp() {
  const applicationsApi = useApplications()
  const [page, setPage] = useState('applications')

  if (page === 'archived') {
    return (
      <Archived
        {...applicationsApi}
        onViewActive={() => setPage('applications')}
      />
    )
  }

  return (
    <Dashboard
      {...applicationsApi}
      onViewArchived={() => setPage('archived')}
    />
  )
}

export default function App() {
  const { session, loading } = useSession()

  if (loading) {
    return <p className="app__loading">Loading…</p>
  }

  if (!session) {
    return <Login />
  }

  return <AuthenticatedApp />
}
