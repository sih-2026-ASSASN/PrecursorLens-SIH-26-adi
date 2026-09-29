import { Menu } from 'lucide-react'
import EngineStatus from './EngineStatus'
import NotificationBell from './NotificationBell'

export default function Navbar({ onMenuClick }) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 lg:px-6 border-b border-line bg-white/90 backdrop-blur relative z-30">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-ink-primary" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-ink-secondary">
          <span className="w-2 h-2 rounded-full bg-safety-green animate-pulse" />
          Live monitoring active
        </div>
      </div>
      <div className="flex items-center gap-4">
        <EngineStatus />
        <NotificationBell />
        <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-semibold">
          SO
        </div>
      </div>
    </header>
  )
}
