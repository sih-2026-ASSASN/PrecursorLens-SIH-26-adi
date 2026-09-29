import { AlertCircle } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export default function PrecursorList({ items = [] }) {
  if (!items.length) return <EmptyState message="No SIF precursors identified." />
  return (
    <ul className="space-y-2">
      {items.map((p, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-ink-primary bg-safety-red/5 border border-safety-red/15 rounded-lg px-3 py-2">
          <AlertCircle size={15} className="text-safety-red shrink-0" />
          {p}
        </li>
      ))}
    </ul>
  )
}
