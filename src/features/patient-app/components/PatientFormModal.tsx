import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientSchema, type PatientFormValues, type DrugFormValues } from '@/validation/patientSchema'
import { useDrugs } from '@/hooks/queries/useDrugs'
import { useCreateDrug } from '@/hooks/mutations/useDrugMutations'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { InlineError } from '@/components/ui/ErrorState'
import { ApiError } from '@/api/client'
import { DrugFormModal } from './DrugFormModal'
import { Plus } from 'lucide-react'

interface PatientFormModalProps {
  onClose: () => void
  onSubmit: (values: PatientFormValues) => Promise<void>
  isSubmitting: boolean
  submitError: unknown
}

// Create-only — there's no PATCH/PUT /patients on the real API.
export function PatientFormModal({ onClose, onSubmit, isSubmitting, submitError }: PatientFormModalProps) {
  const { data: drugs, isLoading: drugsLoading } = useDrugs()
  const createDrug = useCreateDrug()
  const [drugModalOpen, setDrugModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { name: '', mrn: '', diagnosis: '', currentDrugId: '' },
  })

  async function handleCreateDrug(values: DrugFormValues) {
    const drug = await createDrug.mutateAsync(values)
    setValue('currentDrugId', drug.id, { shouldValidate: true })
    setDrugModalOpen(false)
  }

  return (
    <Modal open onClose={onClose} title="Add patient">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Name" htmlFor="patient-name" error={errors.name?.message} required>
          <Input id="patient-name" {...register('name')} />
        </Field>
        <Field label="MRN" htmlFor="patient-mrn" error={errors.mrn?.message} required>
          <Input id="patient-mrn" placeholder="e.g. MRN-1001" {...register('mrn')} />
        </Field>
        <Field label="Diagnosis" htmlFor="patient-diagnosis" error={errors.diagnosis?.message} required>
          <Input id="patient-diagnosis" {...register('diagnosis')} />
        </Field>
        <Field label="Drug" htmlFor="patient-drug" error={errors.currentDrugId?.message} required>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select id="patient-drug" disabled={drugsLoading} {...register('currentDrugId')}>
                <option value="">{drugsLoading ? 'Loading…' : 'Select a drug'}</option>
                {drugs?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={() => setDrugModalOpen(true)} aria-label="Add drug">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Field>

        {submitError ? (
          <InlineError message={submitError instanceof ApiError ? submitError.message : 'Something went wrong. Please try again.'} />
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add patient
          </Button>
        </div>
      </form>

      {drugModalOpen && (
        <DrugFormModal
          onClose={() => setDrugModalOpen(false)}
          onSubmit={handleCreateDrug}
          isSubmitting={createDrug.isPending}
          submitError={createDrug.error}
        />
      )}
    </Modal>
  )
}
