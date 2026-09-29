import EmptyState from '../common/EmptyState'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SIFTrendChart({ data = [] }) {
  if (!data.length) return <EmptyState message="No data yet — submit reports to populate this chart." />
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EF" />
        <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #D9DEE5', borderRadius: 8, fontSize: 12 }} />
        <Line type="monotone" dataKey="precursors" stroke="#D9363E" strokeWidth={2} dot={{ r: 3 }} animationDuration={800} />
      </LineChart>
    </ResponsiveContainer>
  )
}
