import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { usePatients } from '@/hooks/queries/usePatients'
import { useCreatePatient } from '@/hooks/mutations/usePatientMutations'
import type { PatientFormValues } from '@/validation/patientSchema'
import { Select } from '@/components/ui/Select'
import { Field } from '@/components/ui/Field'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { PatientFormModal } from './PatientFormModal'
import { Plus } from 'lucide-react'

// Stands in for a login screen: the real API has no auth
// (API_DOCUMENTATION.md §0), so something has to pick "who am I" for the
// patient app. Also where patients get enrolled — there's no PATCH/PUT
// /patients on the real API, so this is add-only, no edit.
export function PatientSwitcher() {
  const { data: patients, isLoading } = usePatients()
  const { actingPatientId, setActingPatientId } = useAppStore()
  const { showToast } = useToast()

  const [modal, setModal] = useState(false)
  const createPatient = useCreatePatient()

  if (isLoading) return <Skeleton className="h-16 w-full max-w-xs" />

  async function handleCreate(values: PatientFormValues) {
    const patient = await createPatient.mutateAsync(values)
    setActingPatientId(patient.id)
    setModal(false)
    showToast('Patient added.')
  }

  return (
    <>
      <Field label="Select a patient" htmlFor="acting-as">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select id="acting-as" value={actingPatientId} onChange={(e) => setActingPatientId(e.target.value)}>
              {patients?.length ? (
                patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mrn})
                  </option>
                ))
              ) : (
                <option value="">No patients yet</option>
              )}
            </Select>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => setModal(true)} aria-label="Add patient">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Field>

      {modal && (
        <PatientFormModal
          onClose={() => setModal(false)}
          onSubmit={handleCreate}
          isSubmitting={createPatient.isPending}
          submitError={createPatient.error}
        />
      )}
    </>
  )
}
