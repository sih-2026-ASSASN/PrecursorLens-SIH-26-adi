import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatters'
import EmptyState from '../common/EmptyState'

export default function RecentReports({ reports = [] }) {
  if (!reports.length) return <EmptyState message="No safety reports available." />
  return (
    <div className="space-y-2">
      {reports.map((r) => (
        <Link
          to={`/reports/${r.id}`}
          key={r.id}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition group"
        >
          <div className="min-w-0">
            <p className="text-sm text-ink-primary truncate">{r.description}</p>
            <p className="text-[11px] text-ink-secondary">{r.location} · {formatDate(r.submitted_at)}</p>
          </div>
          <span className="text-[11px] shrink-0 ml-3 px-2 py-0.5 rounded-full bg-safety-red/10 text-safety-red">
            {r.risk_level || 'HIGH'}
          </span>
        </Link>
      ))}
    </div>
  )
}
