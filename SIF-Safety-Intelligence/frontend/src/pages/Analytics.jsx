import PageHeader from '../components/layout/PageHeader'
import RiskTrendChart from '../components/charts/RiskTrendChart'
import SIFTrendChart from '../components/charts/SIFTrendChart'
import FailureChart from '../components/charts/FailureChart'
import HazardChart from '../components/charts/HazardChart'
import DepartmentChart from '../components/charts/DepartmentChart'
import LocationChart from '../components/charts/LocationChart'
import RiskHeatmap from '../components/charts/RiskHeatmap'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { useAnalytics } from '../hooks/useAnalytics'
import { analyticsApi } from '../services/analyticsApi'

export default function Analytics() {
  const riskTrends = useAnalytics(analyticsApi.riskTrends, [])
  const sifTrends = useAnalytics(analyticsApi.sifTrends, [])
  const hazards = useAnalytics(analyticsApi.hazards, [])
  const departments = useAnalytics(analyticsApi.departments, [])
  const locations = useAnalytics(analyticsApi.locations, [])
  const reportTypeDist = useAnalytics(analyticsApi.overview, [])
  const controlGaps = useAnalytics(analyticsApi.controlGaps, [])

  const loading = [riskTrends, sifTrends, hazards, departments, locations, reportTypeDist, controlGaps].some((q) => q.loading)
  const error = [riskTrends, sifTrends, hazards, departments, locations, reportTypeDist, controlGaps].some((q) => q.error)

  if (loading) return <Loader />
  if (error) return <ErrorMessage />

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Trends and distributions across all safety reports" />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Report Risk Trend"><RiskTrendChart data={riskTrends.data?.data || []} /></ChartCard>
        <ChartCard title="SIF Precursor Trend"><SIFTrendChart data={sifTrends.data?.data || []} /></ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Risk Distribution">
          <FailureChart data={reportTypeDist.data?.risk_distribution || []} />
        </ChartCard>
        <ChartCard title="Report Type Distribution">
          <FailureChart data={reportTypeDist.data?.report_type_distribution || []} />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Hazard Distribution"><HazardChart data={hazards.data?.data || []} /></ChartCard>
        <ChartCard title="Control-Gap Frequency"><HazardChart data={controlGaps.data?.data || []} /></ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Department Comparison"><DepartmentChart data={departments.data?.data || []} /></ChartCard>
        <ChartCard title="Location Comparison"><LocationChart data={locations.data?.data || []} /></ChartCard>
      </div>

      <ChartCard title="Risk Heatmap — Location × AI-Detected Hazard">
        <RiskHeatmap
          rows={locations.data?.heatmap?.rows || []}
          cols={locations.data?.heatmap?.cols || []}
          matrix={locations.data?.heatmap?.matrix || []}
          counts={locations.data?.heatmap?.counts || []}
        />
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="glass rounded-xl p-5">
      <p className="text-xs text-ink-secondary mb-2">{title}</p>
      {children}
    </div>
  )
}
