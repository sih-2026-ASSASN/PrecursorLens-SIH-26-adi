import { useEffect, useState } from 'react'
import { analysisApi } from '../services/analysisApi'

export function useAnalysis(reportId) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!reportId) { setLoading(false); return }
    setLoading(true)
    analysisApi.get(reportId)
      .then(setAnalysis)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [reportId])

  return { analysis, loading, error }
}
