import { Cpu } from 'lucide-react'
import { useSystemStatus } from '../../hooks/useSystemStatus'

export function describeStatus({ status, error, loading }) {
  if (loading) return { label: 'Checking engine…', tone: 'neutral' }
  if (error || !status) return { label: 'Backend offline', tone: 'bad' }
  if (!status.mongodb?.connected) return { label: 'MongoDB disconnected', tone: 'bad' }
  if (!status.ai_engine?.active) return { label: 'AI/NLP engine unavailable', tone: 'bad' }
  return { label: 'AI/NLP Engine Active', tone: 'good' }
}

const tones = {
  good: 'text-safety-green border-safety-green/30 bg-safety-green/5',
  bad: 'text-safety-red border-safety-red/30 bg-safety-red/5',
  neutral: 'text-ink-secondary border-line',
}

export default function EngineStatus() {
  const s = useSystemStatus()
  const { label, tone } = describeStatus(s)
  return (
    <div className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${tones[tone]}`} title="Live status from /api/status">
      <Cpu size={13} /> {label}
    </div>
  )
}
