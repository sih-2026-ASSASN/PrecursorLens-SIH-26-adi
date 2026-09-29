export default function Loader({ label = 'Loading safety intelligence...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink-secondary animate-fade-in">
      <div className="w-8 h-8 border-2 border-safety-amber/30 border-t-safety-amber rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
