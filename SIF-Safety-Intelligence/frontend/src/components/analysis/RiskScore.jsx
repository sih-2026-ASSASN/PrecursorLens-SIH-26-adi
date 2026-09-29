import RiskBadge from './RiskBadge'

export default function RiskScore({ score = 0, level = 'MEDIUM', confidence = 0 }) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-6">
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
          <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="#E5E9EF" strokeWidth="3" />
          <path
            d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32"
            fill="none" stroke="#1976C9" strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-ink-primary">{score}</div>
      </div>
      <div>
        <p className="text-xs text-ink-secondary mb-1">Risk Level</p>
        <RiskBadge level={level} size="lg" />
        <p className="text-xs text-ink-secondary mt-3">Model Confidence: <span className="text-ink-primary">{Math.round((confidence || 0) * 100)}%</span></p>
      </div>
    </div>
  )
}
