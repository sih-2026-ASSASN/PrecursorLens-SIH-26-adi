import { Link } from 'react-router-dom'
import { AlertTriangle, ShieldAlert, TrendingUp, RefreshCcw } from 'lucide-react'
import { formatDateTime } from '../../utils/formatters'

const sevStyle = {
  CRITICAL: { bg: 'bg-safety-red/10', text: 'text-safety-red', icon: ShieldAlert, pulse: true },
  HIGH: { bg: 'bg-safety-amber/10', text: 'text-safety-amber', icon: AlertTriangle, pulse: false },
  MEDIUM: { bg: 'bg-safety-yellow/10', text: 'text-safety-yellow', icon: TrendingUp, pulse: false },
  LOW: { bg: 'bg-safety-green/10', text: 'text-safety-green', icon: RefreshCcw, pulse: false },
}

export default function AlertCard({ alert }) {
  const s = sevStyle[alert.severity] || sevStyle.MEDIUM
  const Icon = s.icon
  return (
    <div className={`glass rounded-xl p-4 flex items-start gap-3 ${s.pulse ? 'animate-pulse-red' : ''}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.bg} ${s.text}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-semibold ${s.text}`}>{alert.severity}</span>
          <span className="text-[11px] text-ink-secondary">{formatDateTime(alert.time)}</span>
        </div>
        <p className="text-sm text-ink-primary mt-0.5">{alert.message}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-ink-secondary">Status: {alert.status}</span>
          {alert.related_report_id && (
            <Link to={`/reports/${alert.related_report_id}`} className="text-[11px] text-safety-amber hover:underline">
              View Report →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
