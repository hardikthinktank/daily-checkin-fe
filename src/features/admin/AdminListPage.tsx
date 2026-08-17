import { useMemo, useState } from 'react'
import { subMonths } from 'date-fns'
import { useAdminRows } from '@/hooks/queries/useAdminRows'
import { AdminTable } from './components/AdminTable'
import { MonthStripLegend } from '@/components/month-strip/MonthStrip'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatMonthLabel, monthKey, toApiMonthParam } from '@/utils/date'
import { Search, Users } from 'lucide-react'

function monthOptions() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => monthKey(subMonths(now, i)))
}

export function AdminListPage() {
  const [month, setMonth] = useState(monthKey())
  const [query, setQuery] = useState('')
  const { data: rows, isLoading, isError, refetch } = useAdminRows(toApiMonthParam(month))

  const options = useMemo(monthOptions, [])

  const filteredRows = useMemo(() => {
    if (!rows) return rows
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (row) => row.patientName.toLowerCase().includes(q) || row.mrn.toLowerCase().includes(q) || row.diagnosis.toLowerCase().includes(q),
    )
  }, [rows, query])

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Patient roster</h1>
          <p className="text-sm text-slate-500">Every patient in one table — who's checking in, who's flagged, who's behind.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, MRN, diagnosis"
              aria-label="Search patients"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {isLoading && <SkeletonRows rows={6} />}
      {isError && <ErrorState message="Could not load the patient roster." onRetry={() => refetch()} />}
      {!isLoading && !isError && rows && rows.length === 0 && (
        <EmptyState icon={<Users className="h-8 w-8" aria-hidden="true" />} title="No patients enrolled yet" />
      )}
      {!isLoading && !isError && rows && rows.length > 0 && filteredRows && filteredRows.length === 0 && (
        <EmptyState icon={<Search className="h-8 w-8" aria-hidden="true" />} title="No patients match your search" />
      )}
      {!isLoading && !isError && filteredRows && filteredRows.length > 0 && (
        <div className="space-y-3">
          <AdminTable rows={filteredRows} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <MonthStripLegend />
            <p className="text-xs text-slate-400">
              16-day and live-call markers are record-status facts, not a billing determination.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
