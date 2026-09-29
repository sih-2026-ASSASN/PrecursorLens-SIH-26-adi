import { Flame } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export default function HazardList({ items = [] }) {
  if (!items.length) return <EmptyState message="No hazards detected." />
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((h, i) => (
        <span key={i} className="flex items-center gap-1.5 text-xs bg-safety-amber/10 text-safety-amber px-3 py-1.5 rounded-full">
          <Flame size={12} /> {h}
        </span>
      ))}
    </div>
  )
}
