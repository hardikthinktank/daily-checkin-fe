import { useQuery } from '@tanstack/react-query'
import { reportsService } from '@/api/reports.service'
import { queryKeys } from '../queryKeys'

export function useAdminRows(month?: string) {
  return useQuery({
    queryKey: queryKeys.admin.rows(month),
    queryFn: () => reportsService.adminRows(month),
  })
}
