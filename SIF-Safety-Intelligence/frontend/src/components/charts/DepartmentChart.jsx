import EmptyState from '../common/EmptyState'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DepartmentChart({ data = [] }) {
  if (!data.length) return <EmptyState message="No data yet — submit reports to populate this chart." />
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EF" />
        <XAxis type="number" stroke="#64748b" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #D9DEE5', borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="value" fill="#1976C9" radius={[0, 4, 4, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  )
}
