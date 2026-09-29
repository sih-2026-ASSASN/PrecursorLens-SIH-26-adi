import { Lightbulb } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export default function RecommendationCard({ items = [] }) {
  if (!items.length) return <EmptyState message="No recommendations available." />
  return (
    <div className="space-y-2">
      {items.map((r, i) => (
        <div key={i} className="flex items-start gap-2 text-sm text-ink-primary bg-safety-green/5 border border-safety-green/15 rounded-lg px-3 py-2">
          <Lightbulb size={15} className="text-safety-green shrink-0 mt-0.5" />
          {r}
        </div>
      ))}
    </div>
  )
}
