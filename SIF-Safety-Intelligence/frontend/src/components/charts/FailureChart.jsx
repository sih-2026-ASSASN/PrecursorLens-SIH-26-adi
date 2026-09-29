import EmptyState from '../common/EmptyState'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#D9363E', '#F2B233', '#F5C563', '#1976C9', '#20A464', '#a78bfa']

export default function FailureChart({ data = [] }) {
  if (!data.length) return <EmptyState message="No data yet — submit reports to populate this chart." />
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2} animationDuration={800}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #D9DEE5', borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#6B7280' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
