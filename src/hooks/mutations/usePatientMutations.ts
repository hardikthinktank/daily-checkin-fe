import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patientsService } from '@/api/patients.service'
import type { Patient, PatientInput } from '@/types/domain'
import { queryKeys } from '../queryKeys'

// No PATCH/PUT /patients/{id} on the real API — create only, no edit.
export function useCreatePatient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PatientInput) => patientsService.create(input),
    onSuccess: (newPatient) => {
      // Write the new patient into the cache synchronously (not just
      // invalidate-and-refetch) — callers that select it immediately after
      // creating it (PatientSwitcher) would otherwise hit a window where the
      // list hasn't refetched yet, doesn't contain the new id, and a
      // self-healing "unknown id" effect elsewhere silently reassigns the
      // selection back to an existing patient.
      queryClient.setQueryData<Patient[]>(queryKeys.patients.all, (old) => (old ? [...old, newPatient] : [newPatient]))
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}
