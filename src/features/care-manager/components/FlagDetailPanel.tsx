import { useState } from 'react'
import { useFlag } from '@/hooks/queries/useWorkList'
import { usePatient } from '@/hooks/queries/usePatients'
import { useActors } from '@/hooks/queries/useActors'
import { useAcknowledgeFlag, useEscalateFlag, useLogCall, useResolveFlag } from '@/hooks/mutations/useFlagActions'
import { useAppStore } from '@/store/useAppStore'
import type { CallType } from '@/types/domain'
import { FlagLevelBadge } from '@/components/flags/FlagLevelBadge'
import { FlagCauseLine } from '@/components/flags/FlagCauseLine'
import { formatWhySnapshot } from '@/lib/formatWhySnapshot'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { ErrorState, InlineError } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDisplayDateTime } from '@/utils/date'
import { useToast } from '@/components/ui/Toast'
import { ApiError } from '@/api/client'
import { LogCallModal } from './LogCallModal'
import { TextActionModal } from './TextActionModal'
import { MousePointerClick } from 'lucide-react'

const ACTION_LABEL: Record<string, string> = {
  acknowledge: 'Acknowledged',
  log_call: 'Call logged',
  escalate: 'Escalated',
  resolve: 'Resolved',
}

// error_code -> friendlier copy for the cases API_DOCUMENTATION.md calls out
// explicitly; everything else falls back to the server's own `message`,
// which the docs say is already safe to render as-is.
function friendlyActionError(err: unknown, fallback: string): string {
  if (!(err instanceof ApiError)) return fallback
  switch (err.errorCode) {
    case 'already_acknowledged':
      return 'Someone else just took this.'
    case 'flag_already_resolved':
      return 'This item is already resolved.'
    case 'system_actor_forbidden':
      return 'Only a human care team member can log this — pick one above.'
    default:
      return err.message
  }
}

export function FlagDetailPanel({ flagId }: { flagId: string | undefined }) {
  const { data: flag, isLoading, isError, refetch } = useFlag(flagId)
  const { data: patient } = usePatient(flag?.patientId)
  const { data: actors } = useActors()
  const { actorId } = useAppStore()
  const { showToast } = useToast()

  const acknowledge = useAcknowledgeFlag()
  const logCall = useLogCall()
  const escalate = useEscalateFlag()
  const resolve = useResolveFlag()

  const [modal, setModal] = useState<'call' | 'escalate' | 'resolve' | null>(null)
  const [actionError, setActionError] = useState<string>()

  if (!flagId) {
    return (
      <EmptyState
        icon={<MousePointerClick className="h-8 w-8" aria-hidden="true" />}
        title="Select an item"
        description="Choose a patient from the work list to see why they were flagged and take action."
      />
    )
  }

  if (isLoading) return <SkeletonRows rows={5} />
  if (isError || !flag) return <ErrorState message="Could not load this flag." onRetry={() => refetch()} />

  const actorName = (id: string) => actors?.find((a) => a.id === id)?.displayName ?? id

  async function handleAcknowledge() {
    setActionError(undefined)
    try {
      await acknowledge.mutateAsync({ flagId: flag!.id, actorId })
      showToast('Acknowledged.')
    } catch (err) {
      setActionError(friendlyActionError(err, 'Could not acknowledge this item.'))
      refetch()
    }
  }

  async function submitLogCall(entry: { minutes: number; callType: CallType; note?: string }) {
    setActionError(undefined)
    try {
      await logCall.mutateAsync({ flagId: flag!.id, actorId, ...entry })
      showToast('Call logged.')
      setModal(null)
    } catch (err) {
      setActionError(friendlyActionError(err, 'Could not log the call.'))
    }
  }

  async function submitEscalate(reason: string) {
    setActionError(undefined)
    try {
      await escalate.mutateAsync({ flagId: flag!.id, actorId, reason })
      showToast('Escalated to the physician.')
      setModal(null)
    } catch (err) {
      setActionError(friendlyActionError(err, 'Could not escalate this item.'))
    }
  }

  async function submitResolve(note: string) {
    setActionError(undefined)
    try {
      await resolve.mutateAsync({ flagId: flag!.id, actorId, note })
      showToast('Resolved.')
      setModal(null)
    } catch (err) {
      setActionError(friendlyActionError(err, 'Could not resolve this item.'))
    }
  }

  const hasActor = Boolean(actorId)
  const canAcknowledge = flag.status === 'open' && hasActor
  const canAct = (flag.status === 'open' || flag.status === 'acknowledged' || flag.status === 'escalated') && hasActor

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">{patient ? `${patient.name} (${patient.mrn})` : '—'}</CardTitle>
            <FlagLevelBadge level={flag.level} />
          </div>
          <FlagCauseLine flag={flag} />
          <p className="text-xs text-slate-400">
            Status: {flag.status} · Opened {formatDisplayDateTime(flag.firstFiredAt)}
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          {!hasActor && <InlineError message="Pick who you're acting as above before taking action on a flag." />}
          {actionError && <InlineError message={actionError} />}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleAcknowledge} loading={acknowledge.isPending} disabled={!canAcknowledge}>
              Acknowledge
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setModal('call')} disabled={!canAct}>
              Log a call
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setModal('escalate')} disabled={!canAct}>
              Escalate
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setModal('resolve')} disabled={!canAct}>
              Resolve
            </Button>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Events ({flag.eventCount})</h4>
            <ul className="space-y-1.5">
              {flag.events.map((event) => (
                <li key={event.id} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                  <span>{formatWhySnapshot(event.numbersSnapshot)}</span>
                  <span className="text-slate-400">{formatDisplayDateTime(event.firedAt)}</span>
                </li>
              ))}
            </ul>
          </div>

          {flag.actions.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Care team activity</h4>
              <ul className="space-y-1.5">
                {flag.actions.map((action) => (
                  <li key={action.id} className="rounded-md border border-slate-200 px-3 py-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-medium text-slate-700">{ACTION_LABEL[action.actionType]}</span>
                      <span>{formatDisplayDateTime(action.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-slate-600">
                      {actorName(action.actorId)}
                      {action.minutes !== null && ` · ${action.minutes} min (${action.callType})`}
                      {action.reason && ` · ${action.reason}`}
                      {action.note && ` · ${action.note}`}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>

      <LogCallModal open={modal === 'call'} onClose={() => setModal(null)} onSubmit={submitLogCall} isSubmitting={logCall.isPending} />
      <TextActionModal
        open={modal === 'escalate'}
        onClose={() => setModal(null)}
        title="Escalate to physician"
        label="Reason"
        placeholder="Why does the physician need to review this today?"
        confirmLabel="Escalate"
        onSubmit={submitEscalate}
        isSubmitting={escalate.isPending}
      />
      <TextActionModal
        open={modal === 'resolve'}
        onClose={() => setModal(null)}
        title="Resolve"
        label="Note"
        placeholder="What happened, and how was it resolved?"
        confirmLabel="Resolve"
        onSubmit={submitResolve}
        isSubmitting={resolve.isPending}
      />
    </div>
  )
}
