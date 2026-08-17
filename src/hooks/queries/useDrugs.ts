import { useQuery } from '@tanstack/react-query'
import { drugsService } from '@/api/drugs.service'
import { queryKeys } from '../queryKeys'

export function useDrugs() {
  return useQuery({ queryKey: queryKeys.drugs.all, queryFn: drugsService.list })
}
