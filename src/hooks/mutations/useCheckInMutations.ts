import { useMutation, useQueryClient } from '@tanstack/react-query'
import { checkInsService, type SubmitCheckInPayload } from '@/api/checkins.service'
import type { FollowUpAnswers } from '@/types/domain'

export function useSubmitCheckIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubmitCheckInPayload) => checkInsService.submit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flags'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export function useSubmitFollowUps() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ checkInId, answers }: { checkInId: string; answers: FollowUpAnswers }) =>
      checkInsService.submitFollowUps(checkInId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flags'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}
