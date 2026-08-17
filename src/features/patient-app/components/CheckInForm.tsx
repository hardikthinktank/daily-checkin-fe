import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkInSchema, type CheckInFormValues } from '@/validation/checkInSchema'
import { NumberScale } from '@/components/ui/NumberScale'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { InlineError } from '@/components/ui/ErrorState'

interface CheckInFormProps {
  onSubmit: (values: CheckInFormValues) => void
  isSubmitting: boolean
  submitError?: string
}

// A second same-day submission is transparently treated as a correction by
// the backend (API_DOCUMENTATION.md §3.1) — the frontend doesn't need to
// pre-detect "already submitted today" (there's no endpoint to check that
// anyway), it can always show a blank form and let the server do the right
// thing.
export function CheckInForm({ onSubmit, isSubmitting, submitError }: CheckInFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Controller
        control={control}
        name="fatigue"
        render={({ field }) => (
          <Field label="How tired have you been today?" error={errors.fatigue?.message} required>
            <NumberScale name="Fatigue" value={field.value} onChange={field.onChange} lowLabel="Not tired" highLabel="Extremely tired" />
          </Field>
        )}
      />
      <Controller
        control={control}
        name="pain"
        render={({ field }) => (
          <Field label="How much joint pain today?" error={errors.pain?.message} required>
            <NumberScale name="Pain" value={field.value} onChange={field.onChange} lowLabel="No pain" highLabel="Worst pain" />
          </Field>
        )}
      />
      <Controller
        control={control}
        name="swelling"
        render={({ field }) => (
          <Field label="How swollen are your joints today?" error={errors.swelling?.message} required>
            <NumberScale name="Swelling" value={field.value} onChange={field.onChange} lowLabel="No swelling" highLabel="Very swollen" />
          </Field>
        )}
      />

      {submitError && <InlineError message={submitError} />}

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        Submit check-in
      </Button>
    </form>
  )
}
