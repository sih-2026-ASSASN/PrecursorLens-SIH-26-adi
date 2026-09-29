import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { analyticsApi } from '../../services/analyticsApi'
import { formatDateTime } from '../../utils/formatters'

const SEV_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
const SEV_COLOR = { CRITICAL: 'bg-safety-red', HIGH: 'bg-safety-amber', MEDIUM: 'bg-safety-yellow', LOW: 'bg-safety-green' }
const SEV_TEXT = { CRITICAL: 'text-safety-red', HIGH: 'text-safety-amber', MEDIUM: 'text-safety-amber', LOW: 'text-safety-green' }

// Real alerts from MongoDB via GET /api/alerts. Nothing is hard-coded.
export default function NotificationBell() {
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const load = useCallback(async () => {
    try {
      const d = await analyticsApi.alerts()
      setAlerts(d.items || [])
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 30000)
    window.addEventListener('precursorlens:data-changed', load)
    return () => { clearInterval(t); window.removeEventListener('precursorlens:data-changed', load) }
  }, [load])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const toggle = () => { if (!open) load(); setOpen(!open) }

  const openCount = alerts.filter((a) => a.status === 'Open').length
  const sorted = [...alerts].sort((a, b) => (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9) || b.id - a.id)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-label={`Notifications, ${openCount} open alert${openCount === 1 ? '' : 's'}`}
        aria-expanded={open}
        className="relative text-ink-primary hover:text-brand-blue transition"
      >
        <Bell size={19} />
        {openCount > 0 && (
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-safety-red text-white text-[10px] font-semibold flex items-center justify-center">
            {openCount > 99 ? '99+' : openCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] bg-white border border-line rounded-xl shadow-lg z-50 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <p className="text-sm font-semibold text-ink-primary">Notifications</p>
            <span className="text-[11px] text-ink-secondary">{openCount} open</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {error ? (
              <p className="px-4 py-6 text-xs text-safety-red text-center">{error}</p>
            ) : !loaded ? (
              <p className="px-4 py-6 text-xs text-ink-secondary text-center">Loading…</p>
            ) : !sorted.length ? (
              <p className="px-4 py-6 text-xs text-ink-secondary text-center">No alerts. High and critical reports will appear here.</p>
            ) : (
              sorted.map((a) => (
                <div key={a.id} className="px-4 py-3 border-b border-line last:border-0 hover:bg-slate-50">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${SEV_TEXT[a.severity] || 'text-ink-secondary'}`}>
                      <span className={`w-2 h-2 rounded-full ${SEV_COLOR[a.severity] || 'bg-slate-400'}`} />
                      {a.severity}
                    </span>
                    <span className="text-[11px] text-ink-secondary">{formatDateTime(a.time)}</span>
                  </div>
                  <p className="text-sm text-ink-primary mt-1">{a.message}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-ink-secondary">{a.status}</span>
                    {a.related_report_id && (
                      <Link to={`/reports/${a.related_report_id}`} onClick={() => setOpen(false)} className="text-[11px] text-brand-blue hover:underline">
                        View report #{a.related_report_id} →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/alerts" onClick={() => setOpen(false)} className="block text-center text-xs text-brand-blue py-2.5 border-t border-line hover:bg-slate-50 rounded-b-xl">
            View all alerts
          </Link>
        </div>
      )}
    </div>
  )
}
