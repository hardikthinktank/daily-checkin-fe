import { NavLink } from 'react-router-dom'
import { ClipboardList, HeartPulse, LayoutList, Stethoscope } from 'lucide-react'
import { cn } from '@/lib/cn'

const personas = [
  { to: '/patient', label: 'Patient', icon: HeartPulse },
  { to: '/care-manager', label: 'Care Manager', icon: ClipboardList },
  { to: '/admin', label: 'Admin', icon: LayoutList },
  { to: '/physician', label: 'Physician', icon: Stethoscope },
]

export function PersonaSwitcher() {
  return (
    <nav aria-label="Switch persona" className="flex gap-1 overflow-x-auto">
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
  )
}
