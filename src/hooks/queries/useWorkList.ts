import { useQuery } from '@tanstack/react-query'
import { flagsService } from '@/api/flags.service'
import { queryKeys } from '../queryKeys'

// GET /care-manager/worklist takes no filter params — level/search filtering
// happens client-side over the full (server-sorted) result.
export function useWorkList() {
  return useQuery({
    queryKey: queryKeys.flags.workList,
    queryFn: flagsService.workList,
    refetchInterval: 15_000, // PRD: new work "shows up in the console within seconds"
  })
}

export function useFlag(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.flags.detail(id ?? ''),
    queryFn: () => flagsService.get(id as string),
    enabled: Boolean(id),
  })
}
