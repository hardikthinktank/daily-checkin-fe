import type { MonthlySummary } from '@/types/domain'
import { formatDisplayDateTime } from '@/utils/date'
import { EmptyState } from '@/components/ui/EmptyState'

const TYPE_LABEL: Record<MonthlySummary['teamActions'][number]['actionType'], string> = {
  acknowledge: 'Acknowledged',
  log_call: 'Call',
  escalate: 'Escalated',
  resolve: 'Resolved',
}

export function ActivityLog({ entries }: { entries: MonthlySummary['teamActions'] }) {
  if (entries.length === 0) {
    return <EmptyState title="No care team activity this month" />
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry, i) => (
        <li
          key={`${entry.date}-${entry.actionType}-${i}`}
          className="flex flex-col gap-0.5 rounded-lg border border-slate-200 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="font-medium text-slate-900">{TYPE_LABEL[entry.actionType]}</span>
            {entry.minutes !== null && <span className="text-slate-500"> · {entry.minutes} min ({entry.callType})</span>}
            {entry.reason && <span className="text-slate-500"> · {entry.reason}</span>}
            {entry.note && <span className="text-slate-500"> · {entry.note}</span>}
          </span>
          <span className="shrink-0 text-xs text-slate-400">{formatDisplayDateTime(entry.date)}</span>
        </li>
      ))}
    </ul>
  )
}
