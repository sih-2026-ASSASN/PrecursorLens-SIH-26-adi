import { ArrowUpFromLine, Box, Zap, Crosshair, Flame, ArrowUpDown } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'

const RULES = [
  { title: 'Working at Height', icon: ArrowUpFromLine, description: 'Controls for any work performed above ground level where a fall is possible.', controls: ['Fall protection equipment inspected', 'Edge protection or barricading in place', 'Rescue plan established'], precursor: 'Missing fall arrest system' },
  { title: 'Confined Space', icon: Box, description: 'Controls for entry into vessels, tanks, or enclosed spaces with restricted access.', controls: ['Atmospheric testing before entry', 'Standby attendant present', 'Entry permit authorized'], precursor: 'No gas testing before entry' },
  { title: 'Energy Isolation', icon: Zap, description: 'Controls to ensure hazardous energy sources are isolated before maintenance.', controls: ['Lockout/tagout applied', 'Zero-energy verification', 'Isolation points identified'], precursor: 'Incomplete lockout/tagout' },
  { title: 'Line of Fire', icon: Crosshair, description: 'Controls to keep personnel clear of moving, falling, or pressurized hazards.', controls: ['Exclusion zones established', 'Load paths kept clear', 'Pressure released before work'], precursor: 'Personnel positioned in line of fire' },
  { title: 'Hot Work', icon: Flame, description: 'Controls for welding, cutting, grinding, or other spark/flame-generating work.', controls: ['Hot work permit issued', 'Fire watch assigned', 'Flammable materials cleared'], precursor: 'Hot work performed without permit' },
  { title: 'Lifting Operations', icon: ArrowUpDown, description: 'Controls for crane, hoist, and rigging operations.', controls: ['Lift plan reviewed', 'Rigging inspected', 'Exclusion zone maintained'], precursor: 'Uninspected rigging equipment used' },
]

export default function LifeSavingRules() {
  return (
    <div>
      <PageHeader title="Life-Saving Rules" subtitle="Reference framework — placeholder content pending official OIL policy" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RULES.map((r) => {
          const Icon = r.icon
          return (
            <div key={r.title} className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-safety-amber/10 text-safety-amber flex items-center justify-center mb-3">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-semibold text-ink-primary mb-1.5">{r.title}</h3>
              <p className="text-xs text-ink-secondary mb-3">{r.description}</p>
              <p className="text-[11px] text-ink-secondary mb-1.5 font-medium">Critical Controls</p>
              <ul className="space-y-1 mb-3">
                {r.controls.map((c) => (
                  <li key={c} className="text-xs text-ink-primary flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-safety-amber mt-1.5 shrink-0" /> {c}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-safety-red bg-safety-red/10 rounded-md px-2 py-1 inline-block">
                Related precursor: {r.precursor}
              </p>
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-ink-secondary mt-4">
        These are placeholder categories for prototype purposes and do not represent official Oil India Limited safety rules.
      </p>
    </div>
  )
}
