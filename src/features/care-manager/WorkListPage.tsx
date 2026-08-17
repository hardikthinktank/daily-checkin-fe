import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkList } from '@/hooks/queries/useWorkList'
import { WorkListTable } from './components/WorkListTable'
import { FlagDetailPanel } from './components/FlagDetailPanel'
import { ActorSwitcher } from './components/ActorSwitcher'
import { Select } from '@/components/ui/Select'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { FlagLevel } from '@/types/domain'

const LEVEL_OPTIONS: { value: FlagLevel | ''; label: string }[] = [
  { value: '', label: 'All levels' },
  { value: 'Critical', label: 'Critical' },
  { value: 'Urgent', label: 'Urgent' },
  { value: 'Review', label: 'Review' },
]

export function WorkListPage() {
  const { flagId } = useParams()
  const navigate = useNavigate()
  const [level, setLevel] = useState<FlagLevel | ''>('')

  // The worklist endpoint takes no filter params — filter client-side over
  // the full (server-sorted) result.
  const { data: allFlags, isLoading, isError, refetch } = useWorkList()
  const flags = useMemo(() => (level ? allFlags?.filter((f) => f.level === level) : allFlags), [allFlags, level])

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <ActorSwitcher />
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Care manager work list</h1>
            <p className="text-sm text-slate-500">Sorted by level, most urgent first. Notes are recorded but not shown here.</p>
          </div>
          <div className="w-40 shrink-0">
            <Select value={level} onChange={(e) => setLevel(e.target.value as FlagLevel | '')} aria-label="Filter by level">
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[360px_1fr] md:items-start">
        <div className={cn('md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto', flagId ? 'hidden md:block' : 'block')}>
          <WorkListTable
            flags={flags}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            selectedFlagId={flagId}
            onSelect={(id) => navigate(`/care-manager/${id}`)}
          />
        </div>
        <div className={cn(flagId ? 'block' : 'hidden md:block')}>
          {flagId && (
            <button
              onClick={() => navigate('/care-manager')}
              className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 md:hidden"
            >
              <ArrowLeft className="h-4 w-4" /> Back to list
            </button>
          )}
          <FlagDetailPanel flagId={flagId} />
        </div>
      </div>
    </div>
  )
}
