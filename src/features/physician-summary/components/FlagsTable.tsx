import type { MonthlySummary } from '@/types/domain'
import { FlagLevelBadge } from '@/components/flags/FlagLevelBadge'
import { formatDisplayDate } from '@/utils/date'
import { EmptyState } from '@/components/ui/EmptyState'

export function FlagsTable({ rows }: { rows: MonthlySummary['flagsTable'] }) {
  if (rows.length === 0) {
    return <EmptyState title="No flags this month" />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[600px] text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-2">Rule</th>
            <th className="px-3 py-2">Level</th>
            <th className="px-3 py-2">First date</th>
            <th className="px-3 py-2">Events</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Minutes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={`${row.ruleCode}-${row.firstFiredAt}`}>
              <td className="px-3 py-2">
                <div className="font-mono text-xs text-slate-500">
                  {row.ruleCode} v{row.ruleVersion}
                </div>
                <div className="text-slate-700">{row.whatFiredIt}</div>
              </td>
              <td className="px-3 py-2">
                <FlagLevelBadge level={row.level} size="sm" />
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatDisplayDate(row.firstFiredAt)}</td>
              <td className="px-3 py-2 text-slate-600">{row.eventCount}</td>
              <td className="px-3 py-2 text-slate-600 capitalize">{row.status}</td>
              <td className="px-3 py-2 text-slate-600">{row.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
