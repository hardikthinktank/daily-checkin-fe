import { useMutation, useQueryClient } from '@tanstack/react-query'
import { drugsService } from '@/api/drugs.service'
import type { Drug, DrugInput } from '@/types/domain'
import { queryKeys } from '../queryKeys'

export function useCreateDrug() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DrugInput) => drugsService.create(input),
    onSuccess: (newDrug) => {
      // See usePatientMutations.ts's useCreatePatient for why this is a
      // synchronous cache write, not just an invalidation — the patient form
      // selects the new drug immediately after creating it.
      queryClient.setQueryData<Drug[]>(queryKeys.drugs.all, (old) => (old ? [...old, newDrug] : [newDrug]))
      queryClient.invalidateQueries({ queryKey: queryKeys.drugs.all })
    },
  })
}
