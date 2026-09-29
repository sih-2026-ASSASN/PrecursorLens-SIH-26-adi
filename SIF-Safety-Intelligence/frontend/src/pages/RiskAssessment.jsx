import PageHeader from '../components/layout/PageHeader'
import RiskOverview from '../components/dashboard/RiskOverview'
import LocationChart from '../components/charts/LocationChart'
import DepartmentChart from '../components/charts/DepartmentChart'
import HazardChart from '../components/charts/HazardChart'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import { useAnalytics } from '../hooks/useAnalytics'
import { analyticsApi } from '../services/analyticsApi'

export default function RiskAssessment() {
  const overall = useAnalytics(analyticsApi.riskOverall, [])
  const byLoc = useAnalytics(analyticsApi.riskByLocation, [])
  const byDept = useAnalytics(analyticsApi.riskByDepartment, [])
  const gaps = useAnalytics(analyticsApi.controlGaps, [])

  const loading = overall.loading || byLoc.loading || byDept.loading || gaps.loading
  const error = overall.error || byLoc.error || byDept.error || gaps.error

  if (loading) return <Loader />
  if (error) return <ErrorMessage />

  return (
    <div>
      <PageHeader title="Site Risk Intelligence" subtitle="Risk distribution across locations, departments and hazard types" />

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <RiskOverview index={overall.data?.index} level={overall.data?.level} />
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <p className="text-xs text-ink-secondary mb-2">High-Risk Areas</p>
          {overall.data?.high_risk_areas?.length ? (
            <div className="flex flex-wrap gap-2">
              {overall.data.high_risk_areas.map((a, i) => (
                <span key={i} className="text-xs bg-safety-red/10 text-safety-red px-3 py-1.5 rounded-full">{a}</span>
              ))}
            </div>
          ) : <EmptyState message="No high-risk areas identified." />}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-2">Risk by Location</p>
          <LocationChart data={byLoc.data?.data || []} />
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-2">Risk by Department</p>
          <DepartmentChart data={byDept.data?.data || []} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-2">Risk by Hazard Type</p>
          <HazardChart data={overall.data?.hazard_distribution || []} />
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-ink-secondary mb-3">Recurring SIF Precursors</p>
          {overall.data?.recurring_precursors?.length ? (
            <ul className="space-y-2">
              {overall.data.recurring_precursors.map((p, i) => (
                <li key={i} className="flex items-center justify-between text-sm bg-slate-100 rounded-lg px-3 py-2">
                  <span className="text-ink-primary">{p.name}</span>
                  <span className="text-xs text-safety-amber">{p.count}×</span>
                </li>
              ))}
            </ul>
          ) : <EmptyState message="No recurring precursors identified." />}
        </div>
      </div>
    </div>
  )
}
