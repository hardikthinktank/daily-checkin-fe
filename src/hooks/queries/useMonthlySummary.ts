import { useQuery } from '@tanstack/react-query'
import { reportsService } from '@/api/reports.service'
import { queryKeys } from '../queryKeys'

export function useMonthlySummary(patientId: string | undefined, month?: string) {
  return useQuery({
    queryKey: queryKeys.summary.detail(patientId ?? '', month),
    queryFn: () => reportsService.monthlySummary(patientId as string, month),
    enabled: Boolean(patientId),
  })
}

export function useRules(activeOnly = true) {
  return useQuery({ queryKey: queryKeys.rules.all(activeOnly), queryFn: () => reportsService.rules(activeOnly) })
}
