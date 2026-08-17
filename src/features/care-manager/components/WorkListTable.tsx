import type { Flag } from '@/types/domain'
import { FlagLevelBadge } from '@/components/flags/FlagLevelBadge'
import { FlagCauseLine } from '@/components/flags/FlagCauseLine'
import { formatDisplayDateTime } from '@/utils/date'
import { usePatients } from '@/hooks/queries/usePatients'
import { cn } from '@/lib/cn'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { ClipboardCheck } from 'lucide-react'

interface WorkListTableProps {
  flags: Flag[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  selectedFlagId?: string
  onSelect: (flagId: string) => void
}

export function WorkListTable({ flags, isLoading, isError, onRetry, selectedFlagId, onSelect }: WorkListTableProps) {
  const { data: patients } = usePatients()
  const patientName = (id: string) => {
    const patient = patients?.find((p) => p.id === id)
    return patient ? `${patient.name} (${patient.mrn})` : id
  }

  if (isLoading) return <SkeletonRows rows={6} />
  if (isError) return <ErrorState message="Could not load the work list." onRetry={onRetry} />
  if (!flags || flags.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardCheck className="h-8 w-8" aria-hidden="true" />}
        title="Nothing open"
        description="No patients currently need review. New flags will appear here within seconds of a check-in."
      />
    )
  }

  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
      {flags.map((flag) => (
        <li key={flag.id}>
          <button
            onClick={() => onSelect(flag.id)}
            className={cn(
              'flex w-full cursor-pointer flex-col gap-1.5 px-4 py-3 text-left transition-colors hover:bg-slate-50',
              selectedFlagId === flag.id && 'bg-slate-100',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">{patientName(flag.patientId)}</span>
              <FlagLevelBadge level={flag.level} size="sm" />
            </div>
            <FlagCauseLine flag={flag} className="text-xs" />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{formatDisplayDateTime(flag.updatedAt)}</span>
              <span>
                {flag.eventCount} event{flag.eventCount === 1 ? '' : 's'} · {flag.status}
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
