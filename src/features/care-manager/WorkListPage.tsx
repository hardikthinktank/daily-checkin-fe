import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkList } from '@/hooks/queries/useWorkList'
import { usePatients } from '@/hooks/queries/usePatients'
import { WorkListTable } from './components/WorkListTable'
import { FlagDetailPanel } from './components/FlagDetailPanel'
import { ActorSwitcher } from './components/ActorSwitcher'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Search } from 'lucide-react'
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
  const [query, setQuery] = useState('')

  // The worklist endpoint takes no filter params — filter client-side over
  // the full (server-sorted) result.
  const { data: allFlags, isLoading, isError, refetch } = useWorkList()
  const { data: patients } = usePatients()
  const flags = useMemo(() => {
    const byLevel = level ? allFlags?.filter((f) => f.level === level) : allFlags
    if (!byLevel) return byLevel

    const q = query.trim().toLowerCase()
    if (!q) return byLevel

    return byLevel.filter((flag) => {
      const patient = patients?.find((p) => p.id === flag.patientId)
      const searchable = [patient?.name, patient?.mrn, patient?.diagnosis].filter(Boolean).join(' ').toLowerCase()
      return searchable.includes(q)
    })
  }, [allFlags, level, patients, query])

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <ActorSwitcher />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Care manager work list</h1>
            <p className="text-sm text-slate-500">Sorted by level, most urgent first. Notes are recorded but not shown here.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patient, MRN, diagnosis"
                aria-label="Search patient worklist"
                className="pl-9"
              />
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
