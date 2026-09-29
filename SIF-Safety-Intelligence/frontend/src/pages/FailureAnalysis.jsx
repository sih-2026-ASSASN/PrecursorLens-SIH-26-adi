import PageHeader from '../components/layout/PageHeader'
import FailureChart from '../components/charts/FailureChart'
import HazardChart from '../components/charts/HazardChart'
import SIFTrendChart from '../components/charts/SIFTrendChart'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import { useAnalytics } from '../hooks/useAnalytics'
import { analyticsApi } from '../services/analyticsApi'

export default function FailureAnalysis() {
  const failures = useAnalytics(analyticsApi.failures, [])
  const trends = useAnalytics(analyticsApi.failureTrends, [])
  const gaps = useAnalytics(analyticsApi.failureControlGaps, [])

  const loading = failures.loading || trends.loading || gaps.loading
  const error = failures.error || trends.error || gaps.error

  if (loading) return <Loader />
  if (error) return <ErrorMessage />

  return (
    <div>
      <PageHeader
        title="Failure & Control-Gap Analysis"
        subtitle="Recurring weaknesses surfaced from analyzed reports"
      />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-2">Recurring Failure Categories</p>
          <FailureChart data={failures.data?.categories || []} />
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-2">Control-Gap Frequency</p>
          <HazardChart data={gaps.data?.data || []} />
        </div>
      </div>

      <div className="glass rounded-xl p-5 mb-4">
        <p className="text-xs text-ink-secondary mb-2">Failure Trend Over Time</p>
        <SIFTrendChart data={trends.data?.data || []} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-3">Repeated Failure Locations</p>
          {failures.data?.repeated_locations?.length ? (
            <ul className="space-y-2">
              {failures.data.repeated_locations.map((l, i) => (
                <li key={i} className="flex items-center justify-between text-sm bg-slate-100 rounded-lg px-3 py-2">
                  <span className="text-ink-primary">{l.name}</span>
                  <span className="text-xs text-safety-red">{l.count}×</span>
                </li>
              ))}
            </ul>
          ) : <EmptyState message="No repeated failure locations." />}
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-3">Repeated Precursor Combinations</p>
          {failures.data?.repeated_combinations?.length ? (
            <ul className="space-y-2">
              {failures.data.repeated_combinations.map((c, i) => (
                <li key={i} className="text-sm bg-slate-100 rounded-lg px-3 py-2 text-ink-primary">
                  {c.combo.join(' + ')} <span className="text-xs text-safety-amber ml-2">{c.count}×</span>
                </li>
              ))}
            </ul>
          ) : <EmptyState message="No repeated precursor combinations." />}
        </div>
      </div>
      <p className="text-[11px] text-ink-secondary mt-4">
        Categories are derived indicators from the AI/backend layer, not official organizational classifications.
      </p>
    </div>
  )
}
