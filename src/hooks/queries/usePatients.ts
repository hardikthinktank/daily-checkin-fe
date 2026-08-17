import { useQuery } from '@tanstack/react-query'
import { patientsService } from '@/api/patients.service'
import { queryKeys } from '../queryKeys'

export function usePatients() {
  return useQuery({ queryKey: queryKeys.patients.all, queryFn: patientsService.list })
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id ?? ''),
    queryFn: () => patientsService.get(id as string),
    enabled: Boolean(id),
  })
}
