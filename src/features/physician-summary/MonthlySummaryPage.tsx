import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { subMonths } from 'date-fns'
import { usePatients } from '@/hooks/queries/usePatients'
import { useMonthlySummary } from '@/hooks/queries/useMonthlySummary'
import { useRebuildMonthlySummary } from '@/hooks/mutations/useReportMutations'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardTitle } from '@/components/ui/Card'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { MonthStrip, MonthStripLegend } from '@/components/month-strip/MonthStrip'
import { SymptomChart } from '@/components/charts/SymptomChart'
import { ScoreChart } from '@/components/charts/ScoreChart'
import { DaysByLevelChart } from '@/components/charts/DaysByLevelChart'
import { SummaryHeader } from './components/SummaryHeader'
import { FlagsTable } from './components/FlagsTable'
import { ActivityLog } from './components/ActivityLog'
import { RecordFacts } from './components/RecordFacts'
import { formatMonthLabel, monthKey, toApiMonthParam } from '@/utils/date'
import { Printer, RefreshCw, Users } from 'lucide-react'

function monthOptions() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => monthKey(subMonths(now, i)))
}

export function MonthlySummaryPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { data: patients, isLoading: patientsLoading } = usePatients()
  const [month, setMonth] = useState(monthKey())
  const monthChoices = useMemo(monthOptions, [])
  const { showToast } = useToast()

  const activePatientId = patientId ?? patients?.[0]?.id
  const apiMonth = toApiMonthParam(month)
  const { data: summary, isLoading, isError, refetch } = useMonthlySummary(activePatientId, apiMonth)
  const rebuild = useRebuildMonthlySummary(activePatientId ?? '', apiMonth)

  if (patientsLoading) return <SkeletonRows rows={4} />

  if (!patients || patients.length === 0) {
    return <EmptyState icon={<Users className="h-8 w-8" aria-hidden="true" />} title="No patients enrolled yet" />
  }

  async function handleRebuild() {
    await rebuild.mutateAsync()
    showToast('Summary rebuilt.')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Monthly summary</h1>
          <p className="text-sm text-slate-500">One page of what happened between visits.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={activePatientId}
            onChange={(e) => navigate(`/physician/${e.target.value}`)}
            aria-label="Patient"
            className="w-48"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.mrn})
              </option>
            ))}
          </Select>
          <Select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" className="w-40">
            {monthChoices.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </Select>
          <Button variant="secondary" size="sm" onClick={handleRebuild} loading={rebuild.isPending}>
            <RefreshCw className="h-4 w-4" /> Rebuild
          </Button>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {isLoading && <SkeletonRows rows={6} />}
      {isError && <ErrorState message="Could not load the monthly summary." onRetry={() => refetch()} />}

      {!isLoading && !isError && summary && (
        <Card className="print:border-none print:shadow-none">
          <CardBody className="space-y-6">
            <SummaryHeader summary={summary} mrn={patients.find((p) => p.id === activePatientId)?.mrn} />

            <section>
              <CardTitle className="mb-2">Symptoms</CardTitle>
              <SymptomChart data={summary.symptomChart} />
            </section>

            <section>
              <CardTitle className="mb-2">D3 score</CardTitle>
              <ScoreChart
                data={summary.scoreChart.series}
                usualScoreLine={summary.scoreChart.usualScoreLine}
                usualPlus3Line={summary.scoreChart.usualPlus3Line}
              />
            </section>

            <section>
              <CardTitle className="mb-2">Days by level</CardTitle>
              <DaysByLevelChart daysByLevel={summary.daysByLevel} />
            </section>

            <section>
              <CardTitle className="mb-2">Month strip</CardTitle>
              <MonthStrip days={summary.monthStrip} size="md" />
              <div className="mt-2">
                <MonthStripLegend />
              </div>
            </section>

            <section>
              <CardTitle className="mb-2">Flags</CardTitle>
              <FlagsTable rows={summary.flagsTable} />
            </section>

            <section>
              <CardTitle className="mb-2">What the team did</CardTitle>
              <ActivityLog entries={summary.teamActions} />
            </section>

            <section>
              <CardTitle className="mb-2">Record facts</CardTitle>
              <RecordFacts facts={summary.recordFacts} />
            </section>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
