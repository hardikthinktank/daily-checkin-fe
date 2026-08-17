import { Link, Outlet } from 'react-router-dom'
import { PersonaSwitcher } from './PersonaSwitcher'

export function AppShell() {
  return (
    <div className="min-h-full bg-slate-50">
      <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/patient" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">D3</div>
            <span className="text-sm font-semibold text-slate-900">Daily Check-In</span>
          </Link>
          <PersonaSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
