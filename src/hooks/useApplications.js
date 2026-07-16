import { useState, useEffect, useCallback } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

/** When status is Rejected, force the row into the archive. */
function withAutoArchive(fields) {
  if (fields.status === 'Rejected') {
    return { ...fields, is_archived: true }
  }
  return fields
}

export function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(isConfigured)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!isConfigured) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('date_applied', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setApplications(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const create = useCallback(async (fields) => {
    if (!isConfigured) throw new Error('Supabase not configured')
    const payload = withAutoArchive({ is_archived: false, ...fields })
    const { data, error } = await supabase
      .from('applications')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    setApplications((prev) => [data, ...prev])
    return data
  }, [])

  const update = useCallback(async (id, fields) => {
    if (!isConfigured) throw new Error('Supabase not configured')
    const payload = withAutoArchive(fields)
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...payload } : app))
    )
    const { data, error } = await supabase
      .from('applications')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      await fetchAll()
      throw error
    }
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? data : app))
    )
    return data
  }, [fetchAll])

  const remove = useCallback(async (id) => {
    if (!isConfigured) throw new Error('Supabase not configured')
    setApplications((prev) => prev.filter((app) => app.id !== id))
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
    if (error) {
      await fetchAll()
      throw error
    }
  }, [fetchAll])

  const archive = useCallback(async (id) => {
    return update(id, { is_archived: true })
  }, [update])

  const unarchive = useCallback(async (id) => {
    return update(id, { is_archived: false })
  }, [update])

  return {
    applications,
    loading,
    error,
    create,
    update,
    remove,
    archive,
    unarchive,
    refetch: fetchAll,
  }
}
