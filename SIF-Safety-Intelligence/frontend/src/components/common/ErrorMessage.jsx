import { AlertTriangle } from 'lucide-react'

export default function ErrorMessage({ message = 'Unable to load safety data. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-safety-red animate-fade-in">
      <AlertTriangle size={32} />
      <p className="text-sm text-center max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs px-3 py-1.5 rounded-md border border-safety-red/40 hover:bg-safety-red/10 transition">
          Retry
        </button>
      )}
    </div>
  )
}
