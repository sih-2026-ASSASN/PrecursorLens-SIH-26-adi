import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import ReportStatus from '../components/reports/ReportStatus'
import RiskBadge from '../components/analysis/RiskBadge'
import { formatDateTime } from '../utils/formatters'
import { reportApi } from '../services/reportApi'

export default function ReportDetails() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    reportApi.get(id).then(setReport).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [id])

  if (loading) return <Loader />
  if (error) return <ErrorMessage onRetry={load} />
  if (!report) return null

  return (
    <div>
      <Link to="/reports" className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-safety-amber mb-4 transition">
        <ArrowLeft size={14} /> Back to Reports
      </Link>
      <PageHeader
        title={`Report #${report.id}`}
        subtitle={`${report.report_type} · ${formatDateTime(report.submitted_at)}`}
        actions={<Link to={`/analysis/${report.id}`} className="text-xs px-3 py-2 rounded-lg bg-brand-blue text-white font-medium">View AI Analysis</Link>}
      />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <p className="text-xs text-ink-secondary mb-2">Description</p>
          <p className="text-sm text-ink-primary leading-relaxed">{report.description}</p>
        </div>
        <div className="glass rounded-xl p-5 space-y-3">
          <Row label="Location" value={report.location} />
          <Row label="Department" value={report.department} />
          <Row label="Source" value={report.source_format} />
          <Row label="Review Status" value={<ReportStatus status={report.review_status} />} />
          <Row label="Risk Level" value={<RiskBadge level={report.risk_level} />} />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-secondary">{label}</span>
      <span className="text-sm text-ink-primary">{value}</span>
    </div>
  )
}
