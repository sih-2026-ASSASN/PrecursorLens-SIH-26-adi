import * as Icons from 'lucide-react'

// Solid KPI cards in the reference palette: blue / amber / red / green / cyan (+ navy).
const toneMap = {
  blue: { card: 'bg-brand-blue text-white', sub: 'text-white/80', icon: 'bg-white/20' },
  amber: { card: 'bg-safety-amber text-slate-900', sub: 'text-slate-800', icon: 'bg-black/10' },
  red: { card: 'bg-safety-red text-white', sub: 'text-white/85', icon: 'bg-white/20' },
  green: { card: 'bg-safety-green text-white', sub: 'text-white/85', icon: 'bg-white/20' },
  cyan: { card: 'bg-safety-blue text-white', sub: 'text-white/85', icon: 'bg-white/20' },
  navy: { card: 'bg-petro-surface text-white', sub: 'text-white/75', icon: 'bg-white/15' },
}

export default function StatCard({ label, value, icon = 'Activity', tone = 'blue', trend }) {
  const Icon = Icons[icon] || Icons.Activity
  const t = toneMap[tone] || toneMap.blue
  return (
    <div className={`rounded-xl p-4 shadow-card hover:-translate-y-0.5 transition-all duration-200 ${t.card}`}>
      <div className="flex items-center gap-2 text-xs font-medium opacity-95">
        <span className={`w-6 h-6 rounded-md flex items-center justify-center ${t.icon}`}><Icon size={14} /></span>
        {label}
      </div>
      <p className="text-3xl font-bold mt-2 leading-none">{value}</p>
      <p className={`text-[11px] mt-2 min-h-[14px] ${t.sub}`}>{trend || ''}</p>
    </div>
  )
}
