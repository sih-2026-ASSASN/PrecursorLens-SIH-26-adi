import { useEffect, useState, useCallback } from 'react'
import { reportApi } from '../services/reportApi'

export function useReports(params = {}) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await reportApi.list(params)
      setReports(data.items || data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetchReports() }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
}
