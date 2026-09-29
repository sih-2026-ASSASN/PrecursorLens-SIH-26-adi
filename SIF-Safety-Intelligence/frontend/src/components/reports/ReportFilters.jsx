import { REPORT_TYPES } from '../../utils/constants'
import RiskFilterTabs from '../common/RiskFilterTabs'

export default function ReportFilters({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v })
  const inputCls = "bg-white border border-line rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-blue"
  return (
    <div className="glass rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
      <div className="col-span-full"><RiskFilterTabs value={filters.risk_level || ''} onChange={(v) => set('risk_level', v)} /></div>
      <input placeholder="Search..." className={`${inputCls} col-span-2`} value={filters.search || ''} onChange={(e) => set('search', e.target.value)} />
      <select className={inputCls} value={filters.report_type || ''} onChange={(e) => set('report_type', e.target.value)}>
        <option value="">All Types</option>
        {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input placeholder="Department" className={inputCls} value={filters.department || ''} onChange={(e) => set('department', e.target.value)} />
      <input placeholder="Location" className={inputCls} value={filters.location || ''} onChange={(e) => set('location', e.target.value)} />
      <input type="date" className={inputCls} value={filters.date || ''} onChange={(e) => set('date', e.target.value)} />
    </div>
  )
}
