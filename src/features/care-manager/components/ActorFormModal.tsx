import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { actorSchema, type ActorFormValues } from '@/validation/actorSchema'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { InlineError } from '@/components/ui/ErrorState'
import { ApiError } from '@/api/client'

interface ActorFormModalProps {
  onClose: () => void
  onSubmit: (values: ActorFormValues) => Promise<void>
  isSubmitting: boolean
  submitError: unknown
}

// Create-only — there's no PATCH/PUT /actors on the real API. Always creates
// a human actor (actorType is fixed by the caller); this form only asks for
// the display name and role.
export function ActorFormModal({ onClose, onSubmit, isSubmitting, submitError }: ActorFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActorFormValues>({
    resolver: zodResolver(actorSchema),
    defaultValues: { displayName: '', role: 'care_manager' },
  })

  return (
    <Modal open onClose={onClose} title="Add care team member">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Name" htmlFor="actor-name" error={errors.displayName?.message} required>
          <Input id="actor-name" placeholder="e.g. Nadia Ruiz, RN" {...register('displayName')} />
        </Field>
        <Field label="Role" htmlFor="actor-role" required>
          <Select id="actor-role" {...register('role')}>
            <option value="care_manager">Care manager</option>
            <option value="physician">Physician</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>

        {submitError ? (
          <InlineError message={submitError instanceof ApiError ? submitError.message : 'Something went wrong. Please try again.'} />
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add
          </Button>
        </div>
      </form>
    </Modal>
  )
}
