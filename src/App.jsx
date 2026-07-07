import { useSession } from './hooks/useSession'
import { Login } from './components/Login'
import { Dashboard } from './pages/Dashboard'

export default function App() {
  const { session, loading } = useSession()

  if (loading) {
    return <p className="app__loading">Loading…</p>
  }

  if (!session) {
    return <Login />
  }

  return <Dashboard />
}
