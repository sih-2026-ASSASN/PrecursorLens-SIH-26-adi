const OPTIONS = [
  { value: '', label: 'All', active: 'bg-brand-blue text-white border-brand-blue' },
  { value: 'CRITICAL', label: 'Critical', active: 'bg-safety-red text-white border-safety-red' },
  { value: 'HIGH', label: 'High', active: 'bg-safety-amber text-slate-900 border-safety-amber' },
  { value: 'MEDIUM', label: 'Medium', active: 'bg-safety-yellow text-slate-900 border-safety-yellow' },
  { value: 'LOW', label: 'Low', active: 'bg-safety-green text-white border-safety-green' },
]

export default function RiskFilterTabs({ value = '', onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by risk level">
      {OPTIONS.map((o) => (
        <button
          key={o.label}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            value === o.value ? o.active : 'bg-white text-ink-secondary border-line hover:bg-slate-50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
