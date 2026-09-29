import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import AlertFilters from '../components/alerts/AlertFilters'
import AlertCard from '../components/alerts/AlertCard'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import { analyticsApi } from '../services/analyticsApi'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    analyticsApi.alerts().then((d) => setAlerts(d.items || d)).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = alerts.filter((a) =>
    (!filters.severity || a.severity === filters.severity) &&
    (!filters.status || a.status === filters.status)
  )

  return (
    <div>
      <PageHeader title="Alert Center" subtitle="Critical SIF precursors, high-risk reports, and recurring patterns" />
      <AlertFilters filters={filters} onChange={setFilters} />
      {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={load} /> : !filtered.length ? (
        <EmptyState message="No active alerts." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((a) => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}
    </div>
  )
}
