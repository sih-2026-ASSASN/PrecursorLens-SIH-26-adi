import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import ReportStatus from './ReportStatus'
import { RISK_LEVELS } from '../../utils/constants'
import EmptyState from '../common/EmptyState'

export default function ReportTable({ reports = [] }) {
  if (!reports.length) return <EmptyState message="No safety reports available." />
  return (
    <div className="glass rounded-xl overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="text-left text-xs text-ink-secondary border-b border-line">
            <th className="px-4 py-3">Report ID</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">SIF</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Review</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => {
            const risk = RISK_LEVELS[r.risk_level] || RISK_LEVELS.MEDIUM
            return (
              <tr key={r.id} className="border-b border-line hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono text-xs text-ink-secondary">#{r.id}</td>
                <td className="px-4 py-3 text-ink-primary">{formatDate(r.submitted_at)}</td>
                <td className="px-4 py-3 text-ink-primary">{r.report_type}</td>
                <td className="px-4 py-3 text-ink-primary">{r.location}</td>
                <td className="px-4 py-3 text-ink-primary">{r.department}</td>
                <td className="px-4 py-3">
                  {r.sif_detected ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-safety-red/15 text-safety-red">Detected</span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-safety-green/15 text-safety-green">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ color: risk.color, backgroundColor: `${risk.color}20` }}>
                    {risk.label}
                  </span>
                </td>
                <td className="px-4 py-3"><ReportStatus status={r.review_status} /></td>
                <td className="px-4 py-3">
                  <Link to={`/reports/${r.id}`} className="text-ink-secondary hover:text-safety-amber transition inline-flex">
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
