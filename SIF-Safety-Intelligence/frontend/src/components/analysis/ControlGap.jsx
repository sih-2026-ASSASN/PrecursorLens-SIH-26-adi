import { ShieldOff } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export default function ControlGap({ items = [] }) {
  if (!items.length) return <EmptyState message="No control gaps identified." />
  return (
    <ul className="space-y-2">
      {items.map((g, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-ink-primary">
          <ShieldOff size={14} className="text-safety-blue shrink-0" />
          {g}
        </li>
      ))}
    </ul>
  )
}
