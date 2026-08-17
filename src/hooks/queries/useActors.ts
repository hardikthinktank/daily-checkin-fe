import { useQuery } from '@tanstack/react-query'
import { actorsService } from '@/api/actors.service'
import { queryKeys } from '../queryKeys'

export function useActors() {
  return useQuery({ queryKey: queryKeys.actors.all, queryFn: actorsService.list })
}
