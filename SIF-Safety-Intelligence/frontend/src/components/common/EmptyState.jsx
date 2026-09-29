import { Inbox } from 'lucide-react'

export default function EmptyState({ message = 'No safety reports available.', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink-secondary animate-fade-in">
      <Icon size={32} className="opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
