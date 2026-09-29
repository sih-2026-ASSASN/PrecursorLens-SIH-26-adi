import EmptyState from '../common/EmptyState'

const levelColor = (v) => {
  if (v >= 85) return '#D9363E'
  if (v >= 65) return '#F2B233'
  if (v >= 35) return '#F5C563'
  return '#20A464'
}

// Cells are mean AI risk scores of stored reports (location x AI-detected hazard).
// A null cell means there are no stored reports for that pair — it is shown empty, never as a fake 0.
export default function RiskHeatmap({ rows = [], cols = [], matrix = [], counts = [] }) {
  if (!rows.length) return <EmptyState message="No data yet — submit reports to populate this heatmap." />
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs min-w-[500px]">
        <thead>
          <tr>
            <th></th>
            {cols.map((c) => (
              <th key={c} className="text-ink-secondary font-medium px-2 py-1 text-center">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r}>
              <td className="text-ink-secondary pr-2 whitespace-nowrap">{r}</td>
              {cols.map((c, ci) => {
                const v = matrix?.[ri]?.[ci]
                const n = counts?.[ri]?.[ci]
                const empty = v === null || v === undefined
                return (
                  <td key={c} className="p-0">
                    <div
                      className={`w-full h-9 rounded-md flex items-center justify-center text-[11px] font-semibold transition-transform hover:scale-105 ${empty ? 'bg-slate-100 text-slate-400' : 'text-white'}`}
                      style={empty ? undefined : { backgroundColor: levelColor(v) }}
                      title={empty ? `${r} / ${c}: no reports` : `${r} / ${c}: avg risk ${v} (${n} report${n === 1 ? '' : 's'})`}
                    >
                      {empty ? '–' : v}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
