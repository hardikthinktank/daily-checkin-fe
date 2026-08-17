import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useActors } from '@/hooks/queries/useActors'
import { useCreateActor } from '@/hooks/mutations/useActorMutations'
import type { ActorFormValues } from '@/validation/actorSchema'
import { Select } from '@/components/ui/Select'
import { Field } from '@/components/ui/Field'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ActorFormModal } from './ActorFormModal'
import { Plus } from 'lucide-react'

// Stands in for "who's logged in as the care manager" — the real API has no
// auth (API_DOCUMENTATION.md §0), and every care action needs a real human
// actor_id. Mirrors PatientSwitcher's pattern: pick from existing actors, or
// create one. System actors are filtered out (they can't log calls/minutes
// and would just 403 if picked).
export function ActorSwitcher() {
  const { data: actors, isLoading } = useActors()
  const { actorId, setActorId } = useAppStore()
  const { showToast } = useToast()
  const [modal, setModal] = useState(false)
  const createActor = useCreateActor()

  const humanActors = actors?.filter((a) => a.actorType === 'human')
  const isActorValid = humanActors?.some((a) => a.id === actorId) ?? false

  useEffect(() => {
    if (humanActors && humanActors.length > 0 && !isActorValid) {
      setActorId(humanActors[0].id)
    }
  }, [humanActors, isActorValid, setActorId])

  if (isLoading) return <Skeleton className="h-16 w-full max-w-xs" />

  async function handleCreate(values: ActorFormValues) {
    const actor = await createActor.mutateAsync({ displayName: values.displayName, actorType: 'human', role: values.role })
    setActorId(actor.id)
    setModal(false)
    showToast('Care team member added.')
  }

  return (
    <>
      <Field label="Acting as" htmlFor="acting-actor">
        <div className="flex max-w-xs items-center gap-2">
          <div className="flex-1">
            <Select id="acting-actor" value={actorId} onChange={(e) => setActorId(e.target.value)}>
              {humanActors?.length ? (
                humanActors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                  </option>
                ))
              ) : (
                <option value="">No care team members yet</option>
              )}
            </Select>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => setModal(true)} aria-label="Add care team member">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Field>

      {modal && (
        <ActorFormModal onClose={() => setModal(false)} onSubmit={handleCreate} isSubmitting={createActor.isPending} submitError={createActor.error} />
      )}
    </>
  )
}
