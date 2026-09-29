import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import StatCard from '../components/dashboard/StatCard'
import RiskOverview from '../components/dashboard/RiskOverview'
import RecentReports from '../components/dashboard/RecentReports'
import AlertSummary from '../components/dashboard/AlertSummary'
import RiskTrendChart from '../components/charts/RiskTrendChart'
import HazardChart from '../components/charts/HazardChart'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { analyticsApi } from '../services/analyticsApi'

export default function Dashboard() {
  const [overview, setOverview] = useState(null)
  const [trends, setTrends] = useState([])
  const [hazards, setHazards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    Promise.all([analyticsApi.overview(), analyticsApi.riskTrends(), analyticsApi.hazards()])
      .then(([o, t, h]) => { setOverview(o); setTrends(t.data || []); setHazards(h.data || []) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={load} />

  const total = overview.total_reports

  return (
    <div>
      <PageHeader title="Safety Intelligence Dashboard" subtitle="Proactive HSE Monitoring & Precursor Detection" />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Reports Analyzed" value={overview.total_reports} icon="FileText" tone="blue" />
        <StatCard label="SIF Precursors" value={overview.sif_precursors} icon="AlertTriangle" tone="amber"
          trend={total ? `${Math.round((overview.sif_precursors / total) * 100)}% of reports` : ''} />
        <StatCard label="High/Critical Risk" value={overview.high_critical_reports} icon="ShieldAlert" tone="red"
          trend={overview.high_critical_reports ? 'Needs attention' : ''} />
        <StatCard label="Active Alerts" value={overview.active_alerts} icon="Bell" tone="navy" />
        <StatCard label="Reviewed" value={overview.reviewed_reports} icon="CheckCircle2" tone="green"
          trend={total ? `${overview.reviewed_reports} of ${total} reports` : ''} />
        <StatCard label="Avg AI Confidence" value={overview.avg_ai_confidence == null ? '—' : `${Math.round(overview.avg_ai_confidence * 100)}%`} icon="BrainCircuit" tone="cyan"
          trend={overview.avg_ai_confidence == null ? '' : 'Mean model confidence'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <RiskOverview index={overview.site_risk_index} level={overview.site_risk_level} />
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <p className="text-xs text-ink-secondary mb-2">Risk Trend</p>
          <RiskTrendChart data={trends} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <p className="text-xs text-ink-secondary mb-2">Top SIF Precursor Categories</p>
          <HazardChart data={hazards} />
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-3">Recent Alerts</p>
          <AlertSummary alerts={overview.recent_alerts} />
        </div>
      </div>

      <div className="glass rounded-xl p-5 mt-4">
        <p className="text-xs text-ink-secondary mb-3">Recent High-Risk Reports</p>
        <RecentReports reports={overview.recent_high_risk_reports} />
      </div>
    </div>
  )
}
