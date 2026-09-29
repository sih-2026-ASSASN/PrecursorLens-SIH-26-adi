import { RISK_LEVELS } from '../../utils/constants'

export default function RiskOverview({ index = 0, level = null }) {
  const noData = !level
  const risk = noData ? { label: 'No data', color: '#6B7280' } : (RISK_LEVELS[level] || RISK_LEVELS.MEDIUM)
  return (
    <div className="glass rounded-xl p-5">
      <p className="text-xs text-ink-secondary mb-3">Overall Site Risk Index</p>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-ink-primary">{noData ? '—' : index}</span>
        <span
          className="mb-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color: risk.color, backgroundColor: `${risk.color}20` }}
        >
          {risk.label}
        </span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${noData ? 0 : index}%`, backgroundColor: risk.color }}
        />
      </div>
    </div>
  )
}
