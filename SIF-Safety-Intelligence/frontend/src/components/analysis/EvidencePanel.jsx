import EmptyState from '../common/EmptyState'

export default function EvidencePanel({ items = [] }) {
  if (!items.length) return <EmptyState message="No supporting evidence returned." />
  return (
    <div className="space-y-2">
      {items.map((e, i) => (
        <blockquote key={i} className="text-sm text-ink-primary italic border-l-2 border-safety-amber/40 pl-3">
          "{e}"
        </blockquote>
      ))}
    </div>
  )
}
