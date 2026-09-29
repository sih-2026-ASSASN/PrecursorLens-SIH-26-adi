import EmptyState from '../common/EmptyState'
import { formatDateTime } from '../../utils/formatters'

const sevColor = { CRITICAL: 'bg-safety-red', HIGH: 'bg-safety-amber', MEDIUM: 'bg-safety-yellow', LOW: 'bg-safety-green' }

export default function AlertSummary({ alerts = [] }) {
  if (!alerts.length) return <EmptyState message="No active alerts." />
  return (
    <div className="space-y-2">
      {alerts.map((a) => (
        <div key={a.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 ${a.severity === 'CRITICAL' ? 'animate-pulse-red' : ''}`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${sevColor[a.severity] || 'bg-safety-amber'}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-primary truncate">{a.message}</p>
            <p className="text-[11px] text-ink-secondary">{formatDateTime(a.time)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
