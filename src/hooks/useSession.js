import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check if a session already exists (e.g. you refreshed the page)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 2. Listen for future changes: login, logout, token refresh
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // 3. Clean up the listener when the component unmounts
    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, loading }
}
