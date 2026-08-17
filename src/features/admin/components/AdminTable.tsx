import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AdminRow } from '@/types/domain'
import { MonthStrip } from '@/components/month-strip/MonthStrip'
import { FLAG_LEVEL_LABEL } from '@/lib/flagLevel'
import { formatDisplayDate } from '@/utils/date'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'

type SortKey = 'name' | 'therapy' | 'checkIns' | 'averageScore' | 'lastCheckIn' | 'openItems' | 'minutes'

const columns: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Patient' },
  { key: 'therapy', label: 'Therapy' },
  { key: 'checkIns', label: 'Check-ins' },
  { key: 'averageScore', label: 'Avg score' },
  { key: 'lastCheckIn', label: 'Last check-in' },
  { key: 'openItems', label: 'Open items' },
  { key: 'minutes', label: 'Minutes' },
]

function sortValue(row: AdminRow, key: SortKey): number | string {
  switch (key) {
    case 'name':
      return row.patientName
    case 'therapy':
      return row.therapy
    case 'checkIns':
      return row.checkinsPct
    case 'averageScore':
      return row.averageScore ?? -1
    case 'lastCheckIn':
      return row.lastCheckinDate ?? ''
    case 'openItems':
      return row.openItems
    case 'minutes':
      return row.minutesThisMonth
  }
}

export function AdminTable({ rows }: { rows: AdminRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('openItems')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-270 text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2.5">
                <button onClick={() => toggleSort(col.key)} className="inline-flex cursor-pointer items-center gap-1 hover:text-slate-800">
                  {col.label}
                  {sortKey === col.key ? (
                    sortDir === 'asc' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </th>
            ))}
            <th className="px-3 py-2.5">Month</th>
            <th className="px-3 py-2.5">Live call</th>
            <th className="px-3 py-2.5">16-day</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((row) => (
            <tr key={row.patientId} className="hover:bg-slate-50">
              <td className="px-3 py-2.5">
                <Link to={`/physician/${row.patientId}`} className="font-medium text-slate-900 hover:underline">
                  {row.patientName} ({row.mrn})
                </Link>
                <div className="text-xs text-slate-500">{row.diagnosis}</div>
              </td>
              <td className="px-3 py-2.5 text-slate-700">{row.therapy}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                {row.checkinsDone}/{row.checkinsExpected}
                <span className="ml-1 text-xs text-slate-400">({Math.round(row.checkinsPct)}%)</span>
              </td>
              <td className="px-3 py-2.5 text-slate-700">{row.averageScore ?? '—'}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                {row.lastCheckinDate ? (
                  <>
                    {formatDisplayDate(row.lastCheckinDate)}
                    {row.lastCheckinLevel && <span className="ml-1.5 text-xs text-slate-400">{FLAG_LEVEL_LABEL[row.lastCheckinLevel]}</span>}
                  </>
                ) : (
                  '—'
                )}
              </td>
              <td className={cn('px-3 py-2.5 font-medium', row.openItems > 0 ? 'text-level-urgent' : 'text-slate-700')}>{row.openItems}</td>
              <td className="px-3 py-2.5 text-slate-700">{row.minutesThisMonth}</td>
              <td className="px-3 py-2.5">
                <MonthStrip days={row.monthStrip} />
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    row.liveCallThisMonth ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {row.liveCallThisMonth ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-3 py-2.5 text-xs text-slate-600">
                {row.sixteenDayMarkerMet ? '16+ days' : `${row.daysOfDataThisMonth} of 16`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
