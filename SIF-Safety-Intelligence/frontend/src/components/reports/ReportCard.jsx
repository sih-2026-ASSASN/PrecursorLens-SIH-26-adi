import { Link } from 'react-router-dom'
import { formatDate, truncate } from '../../utils/formatters'
import ReportStatus from './ReportStatus'

export default function ReportCard({ report }) {
  return (
    <Link to={`/reports/${report.id}`} className="glass rounded-xl p-4 block hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-ink-secondary">#{report.id}</span>
        <ReportStatus status={report.review_status} />
      </div>
      <p className="text-sm text-ink-primary">{truncate(report.description, 100)}</p>
      <p className="text-[11px] text-ink-secondary mt-2">{report.location} · {formatDate(report.submitted_at)}</p>
    </Link>
  )
}
