import { NavLink } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { NAV_SECTIONS } from '../../utils/constants'
import { X, Fuel } from 'lucide-react'

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 shrink-0 bg-petro-green border-r border-white/5 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-blue/20 flex items-center justify-center text-white">
              <Fuel size={18} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide text-white leading-tight">PrecursorLens</p>
              <p className="text-[10px] text-slate-300 leading-tight">AI-Powered Safety Intelligence</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = Icons[item.icon] || Icons.Circle
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative ${
                          isActive
                            ? 'bg-brand-blue/20 text-white shadow-glow'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-blue rounded-full" />}
                          <Icon size={17} className="shrink-0" />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/5 text-[10px] text-slate-400">
          SIH PS 26165 · Oil India Limited
        </div>
      </aside>
    </>
  )
}
