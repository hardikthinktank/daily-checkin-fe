import { useMutation, useQueryClient } from '@tanstack/react-query'
import { actorsService } from '@/api/actors.service'
import type { Actor, ActorInput } from '@/types/domain'
import { queryKeys } from '../queryKeys'

export function useCreateActor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ActorInput) => actorsService.create(input),
    onSuccess: (newActor) => {
      // See usePatientMutations.ts's useCreatePatient for why this is a
      // synchronous cache write, not just an invalidation.
      queryClient.setQueryData<Actor[]>(queryKeys.actors.all, (old) => (old ? [...old, newActor] : [newActor]))
      queryClient.invalidateQueries({ queryKey: queryKeys.actors.all })
    },
  })
}
