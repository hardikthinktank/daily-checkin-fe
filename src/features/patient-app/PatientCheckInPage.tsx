import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { usePatient, usePatients } from '@/hooks/queries/usePatients'
import { useSubmitCheckIn, useSubmitFollowUps } from '@/hooks/mutations/useCheckInMutations'
import type { FollowUpAnswers, FollowUpQuestionId } from '@/types/domain'
import { CheckInForm } from './components/CheckInForm'
import { FollowUpForm } from './components/FollowUpForm'
import { PatientSwitcher } from './components/PatientSwitcher'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { ApiError } from '@/api/client'
import { CheckCircle2, Users } from 'lucide-react'

type Phase = 'form' | 'followups' | 'done'

// Some follow-up questions only become required once an earlier round's
// answer is known (e.g. R8's "what got in the way" only makes sense once
// medication is "no" — see PRD sections 5 & 6 / API_DOCUMENTATION.md §3.1).
// Cap rounds defensively so a misbehaving backend can't strand the patient.
const MAX_FOLLOW_UP_ROUNDS = 5

export function PatientCheckInPage() {
  const { actingPatientId, setActingPatientId } = useAppStore()
  const { data: patients, isLoading: patientsLoading, isError: patientsError, refetch: refetchPatients } = usePatients()

  // "Acting as" is remembered across reloads (see store/useAppStore.ts), but
  // the id it points at isn't guaranteed to still exist (a fresh backend
  // reseed, a different environment, etc). Self-heal to a real patient
  // instead of getting stuck on a permanent "not found" error.
  const isActingPatientValid = patients?.some((p) => p.id === actingPatientId) ?? false
  useEffect(() => {
    if (patients && patients.length > 0 && !isActingPatientValid) {
      setActingPatientId(patients[0].id)
    }
  }, [patients, isActingPatientValid, setActingPatientId])

  const validPatientId = isActingPatientValid ? actingPatientId : undefined
  const { data: patient, isLoading: patientLoading, isError: patientError, refetch: refetchPatient } = usePatient(validPatientId)

  const submitCheckIn = useSubmitCheckIn()
  const submitFollowUps = useSubmitFollowUps()

  const [phase, setPhase] = useState<Phase>('form')
  const [pendingCheckIn, setPendingCheckIn] = useState<{ id: string; requiredFollowUps: FollowUpQuestionId[]; round: number } | null>(
    null,
  )
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID())

  const isSelfHealing = !patientsLoading && !patientsError && patients && patients.length > 0 && !isActingPatientValid
  const isCheckInLoading = patientsLoading || isSelfHealing || patientLoading

  function resetToForm() {
    setPhase('form')
    setPendingCheckIn(null)
    setSubmissionId(crypto.randomUUID())
  }

  async function handleBaseSubmit(values: { fatigue: number; pain: number; swelling: number }) {
    const result = await submitCheckIn.mutateAsync({ patientId: actingPatientId, submissionId, ...values })
    if (result.requiredFollowUps.length > 0) {
      setPendingCheckIn({ id: result.id, requiredFollowUps: result.requiredFollowUps, round: 1 })
      setPhase('followups')
    } else {
      setPhase('done')
    }
  }

  async function handleFollowUpSubmit(answers: FollowUpAnswers) {
    if (!pendingCheckIn) return
    const result = await submitFollowUps.mutateAsync({ checkInId: pendingCheckIn.id, answers })
    if (result.requiredFollowUps.length > 0 && pendingCheckIn.round < MAX_FOLLOW_UP_ROUNDS) {
      // A prior answer unlocked another required question (e.g. medication
      // reason) — loop back with another round instead of finishing.
      setPendingCheckIn({ id: pendingCheckIn.id, requiredFollowUps: result.requiredFollowUps, round: pendingCheckIn.round + 1 })
    } else {
      setPhase('done')
    }
  }

  // The patient selector (with its "add patient" action) stays reachable no
  // matter what state the rest of the page is in — only this area swaps.
  function renderCheckInArea() {
    if (patients && patients.length === 0) {
      return (
        <EmptyState
          icon={<Users className="h-8 w-8" aria-hidden="true" />}
          title="No patients yet"
          description="Add a patient using the selector above to get started."
        />
      )
    }
    if (patientsError) {
      return <ErrorState message="Could not load the patient list." onRetry={() => refetchPatients()} />
    }
    if (isCheckInLoading) {
      return <SkeletonRows rows={3} />
    }
    if (patientError || !patient) {
      return <ErrorState message="Could not load the patient app." onRetry={() => refetchPatient()} />
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{phase === 'done' ? "Today's check-in" : 'Daily check-in'}</CardTitle>
          <p className="mt-0.5 text-xs text-slate-500">
            {patient.name} ({patient.mrn}) · {patient.diagnosis}
          </p>
        </CardHeader>
        <CardBody>
          {phase === 'form' && (
            <CheckInForm isSubmitting={submitCheckIn.isPending} submitError={submitErrorMessage(submitCheckIn.error)} onSubmit={handleBaseSubmit} />
          )}
          {phase === 'followups' && pendingCheckIn && (
            <FollowUpForm
              key={pendingCheckIn.round}
              questionIds={pendingCheckIn.requiredFollowUps}
              isSubmitting={submitFollowUps.isPending}
              onSubmit={handleFollowUpSubmit}
            />
          )}
          {phase === 'done' && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-900">Thanks — your check-in was recorded.</p>
              <p className="max-w-sm text-sm text-slate-500">
                If anything you told us needs a closer look, a member of your care team will reach out.
              </p>
              <Button variant="secondary" size="sm" onClick={resetToForm}>
                Back to today's check-in
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PatientSwitcher />
      {renderCheckInArea()}
    </div>
  )
}

function submitErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined
  if (error instanceof ApiError) return error.message
  return 'Something went wrong submitting your check-in. Please try again.'
}
