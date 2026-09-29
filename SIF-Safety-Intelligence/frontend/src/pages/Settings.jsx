import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/common/Button'
import { API_BASE_URL } from '../utils/constants'
import { useSystemStatus } from '../hooks/useSystemStatus'
import { describeStatus } from '../components/layout/EngineStatus'

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL)
  const [notifications, setNotifications] = useState(true)
  const [aiStatus, setAiStatus] = useState(null)
  const sys = useSystemStatus()
  const engine = describeStatus(sys)
  const ai = sys.status?.ai_engine
  const mongo = sys.status?.mongodb

  const checkHealth = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/health`)
      setAiStatus(res.ok ? 'online' : 'offline')
    } catch {
      setAiStatus('offline')
    }
  }

  const inputCls = "w-full bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-blue"

  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />
      <div className="grid lg:grid-cols-2 gap-4 max-w-4xl">
        <div className="glass rounded-xl p-5">
          <p className="text-sm font-semibold text-ink-primary mb-3">Backend API</p>
          <label className="text-xs text-ink-secondary mb-1.5 block">API Base URL</label>
          <input className={inputCls} value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
          <Button variant="outline" className="mt-3" onClick={checkHealth}>Check Connection</Button>
          {aiStatus && (
            <p className={`flex items-center gap-1.5 text-xs mt-3 ${aiStatus === 'online' ? 'text-safety-green' : 'text-safety-red'}`}>
              {aiStatus === 'online' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              Backend is {aiStatus}
            </p>
          )}
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-sm font-semibold text-ink-primary mb-3">AI Engine &amp; Database Status</p>
          <span className={`inline-block text-xs px-3 py-1.5 rounded-full ${engine.tone === 'good' ? 'bg-safety-green/10 text-safety-green' : engine.tone === 'bad' ? 'bg-safety-red/10 text-safety-red' : 'bg-slate-100 text-ink-secondary'}`}>
            {engine.label}
          </span>
          <div className="text-xs text-ink-secondary space-y-1 mt-3">
            {sys.error && <p className="text-safety-red">{sys.error}</p>}
            {ai && <p>AI/NLP engine: {ai.active ? 'active' : 'unavailable'} · model {ai.model_file}{ai.error ? ` · ${ai.error}` : ''}</p>}
            {mongo && <p>MongoDB: {mongo.connected ? `connected · database "${mongo.database}" · v${mongo.server_version} · ${mongo.reports_stored} report(s) stored` : `disconnected · ${mongo.error}`}</p>}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-sm font-semibold text-ink-primary mb-3">Notification Settings</p>
          <label className="flex items-center gap-2 text-sm text-ink-primary">
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="accent-safety-amber" />
            Enable critical alert notifications
          </label>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-sm font-semibold text-ink-primary mb-3">System Information</p>
          <div className="text-xs text-ink-secondary space-y-1">
            <p>Project: PrecursorLens — SIH PS 26165</p>
            <p>Organization: Oil India Limited</p>
            <p>Prototype status: Not production/safety-certified</p>
          </div>
        </div>
      </div>
    </div>
  )
}
