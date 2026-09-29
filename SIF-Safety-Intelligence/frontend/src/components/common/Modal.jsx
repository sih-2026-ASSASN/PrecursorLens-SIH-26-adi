import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in" onClick={onClose}>
      <div
        className="glass rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink-primary">{title}</h3>
          <button onClick={onClose} className="text-ink-secondary hover:text-ink-primary transition">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
