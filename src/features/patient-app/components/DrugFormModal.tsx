import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { drugSchema, type DrugFormValues } from '@/validation/patientSchema'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { InlineError } from '@/components/ui/ErrorState'
import { ApiError } from '@/api/client'

interface DrugFormModalProps {
  onClose: () => void
  onSubmit: (values: DrugFormValues) => Promise<void>
  isSubmitting: boolean
  submitError: unknown
}

export function DrugFormModal({ onClose, onSubmit, isSubmitting, submitError }: DrugFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DrugFormValues>({
    resolver: zodResolver(drugSchema),
    defaultValues: { name: '', isBiologicOrSimilar: false },
  })

  return (
    <Modal open onClose={onClose} title="Add drug">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Name" htmlFor="drug-name" error={errors.name?.message} required>
          <Input id="drug-name" placeholder="e.g. Adalimumab (biologic)" {...register('name')} />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border-slate-300" {...register('isBiologicOrSimilar')} />
          On a biologic or similar drug
        </label>
        <p className="text-xs text-slate-500">
          Gates whether the fever follow-up question and its Critical failsafe are ever reachable for patients on this drug.
        </p>

        {submitError ? (
          <InlineError message={submitError instanceof ApiError ? submitError.message : 'Something went wrong. Please try again.'} />
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add drug
          </Button>
        </div>
      </form>
    </Modal>
  )
}
