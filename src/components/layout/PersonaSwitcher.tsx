import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ClipboardList, HeartPulse, LayoutList, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/cn'

const personas = [
  { to: '/patient', label: 'Patient', icon: HeartPulse },
  { to: '/care-manager', label: 'Care Manager', icon: ClipboardList },
  { to: '/admin', label: 'Admin', icon: LayoutList },
  { to: '/physician', label: 'Physician', icon: Stethoscope },
]

export function PersonaSwitcher() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const activePersona = personas.find(({ to }) => location.pathname.startsWith(to)) ?? personas[0]
  const ActiveIcon = activePersona.icon

  return (
    <>
      <nav aria-label="Switch persona" className="hidden md:flex md:items-center md:gap-1 md:overflow-visible">
        {personas.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="relative md:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-900 shadow-sm"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Open persona menu"
        >
          <span className="flex items-center gap-2">
            <ActiveIcon className="h-4 w-4 text-slate-600" aria-hidden="true" />
            {activePersona.label}
          </span>
          <ChevronDown className={cn('h-4 w-4 text-slate-500 transition-transform', menuOpen && 'rotate-180')} aria-hidden="true" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-full min-w-[220px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            {personas.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors',
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50',
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
