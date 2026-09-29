export default function AlertFilters({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v })
  const inputCls = "bg-white border border-line rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-blue"
  return (
    <div className="glass rounded-xl p-4 flex flex-wrap gap-3 mb-4">
      <select className={inputCls} value={filters.severity || ''} onChange={(e) => set('severity', e.target.value)}>
        <option value="">All Severities</option>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <select className={inputCls} value={filters.status || ''} onChange={(e) => set('status', e.target.value)}>
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="Acknowledged">Acknowledged</option>
        <option value="Resolved">Resolved</option>
      </select>
    </div>
  )
}
