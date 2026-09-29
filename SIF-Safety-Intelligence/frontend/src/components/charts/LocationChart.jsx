import EmptyState from '../common/EmptyState'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function LocationChart({ data = [] }) {
  if (!data.length) return <EmptyState message="No data yet — submit reports to populate this chart." />
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EF" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #D9DEE5', borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="value" fill="#20A464" radius={[4, 4, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  )
}
