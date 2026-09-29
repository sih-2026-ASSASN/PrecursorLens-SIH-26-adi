import EmptyState from '../common/EmptyState'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RiskTrendChart({ data = [] }) {
  if (!data.length) return <EmptyState message="No data yet — submit reports to populate this chart." />
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F2B233" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#F2B233" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EF" />
        <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #D9DEE5', borderRadius: 8, fontSize: 12 }} />
        <Area type="monotone" dataKey="risk" stroke="#F2B233" fill="url(#riskGrad)" strokeWidth={2} animationDuration={800} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
