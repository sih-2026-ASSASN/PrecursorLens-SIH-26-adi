import { Link } from 'react-router-dom'
import ReviewStatus from './ReviewStatus'
import RiskBadge from '../analysis/RiskBadge'
import { truncate } from '../../utils/formatters'

export default function ReviewCard({ review, onOpen }) {
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-ink-secondary">Report #{review.report_id}</span>
        <ReviewStatus status={review.status} />
      </div>
      <p className="text-sm text-ink-primary">{truncate(review.description, 110)}</p>
      <div className="flex items-center justify-between">
        <RiskBadge level={review.risk_level} />
        <button onClick={() => onOpen(review)} className="text-xs text-safety-amber hover:underline">
          Review →
        </button>
      </div>
    </div>
  )
}
