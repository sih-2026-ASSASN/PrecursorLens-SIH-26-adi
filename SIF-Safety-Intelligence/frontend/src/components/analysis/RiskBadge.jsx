import { RISK_LEVELS } from '../../utils/constants'

export default function RiskBadge({ level = 'MEDIUM', size = 'md' }) {
  const risk = RISK_LEVELS[level] || RISK_LEVELS.MEDIUM
  const sizeCls = size === 'lg' ? 'text-sm px-3 py-1' : 'text-[11px] px-2 py-0.5'
  return (
    <span className={`${sizeCls} rounded-full font-semibold`} style={{ color: risk.color, backgroundColor: `${risk.color}20` }}>
      {risk.label}
    </span>
  )
}
