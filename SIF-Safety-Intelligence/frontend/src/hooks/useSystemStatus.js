import { useEffect, useState, useCallback } from 'react'
import { analyticsApi } from '../services/analyticsApi'

// Polls the real /api/status (MongoDB ping + AI engine probe). No assumed/default "active" state.
export function useSystemStatus(intervalMs = 30000) {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setStatus(await analyticsApi.status())
      setError(null)
    } catch (e) {
      setStatus(null)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, intervalMs)
    return () => clearInterval(t)
  }, [refresh, intervalMs])

  return { status, error, loading, refresh }
}
