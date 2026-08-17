import { useMutation, useQueryClient } from '@tanstack/react-query'
import { flagsService } from '@/api/flags.service'
import type { CallType } from '@/types/domain'
import { queryKeys } from '../queryKeys'

function invalidateFlag(queryClient: ReturnType<typeof useQueryClient>, flagId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.flags.detail(flagId) })
  queryClient.invalidateQueries({ queryKey: ['flags', 'work-list'] })
  queryClient.invalidateQueries({ queryKey: ['admin'] })
  queryClient.invalidateQueries({ queryKey: ['summary'] })
}

export function useAcknowledgeFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flagId, actorId }: { flagId: string; actorId: string }) => flagsService.acknowledge(flagId, actorId),
    onSuccess: (_data, variables) => invalidateFlag(queryClient, variables.flagId),
  })
}

export function useLogCall() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flagId, ...entry }: { flagId: string; actorId: string; minutes: number; callType: CallType; note?: string }) =>
      flagsService.logCall(flagId, entry),
    onSuccess: (_data, variables) => invalidateFlag(queryClient, variables.flagId),
  })
}

export function useEscalateFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flagId, ...entry }: { flagId: string; actorId: string; reason: string }) => flagsService.escalate(flagId, entry),
    onSuccess: (_data, variables) => invalidateFlag(queryClient, variables.flagId),
  })
}

export function useResolveFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flagId, ...entry }: { flagId: string; actorId: string; note: string }) => flagsService.resolve(flagId, entry),
    onSuccess: (_data, variables) => invalidateFlag(queryClient, variables.flagId),
  })
}
