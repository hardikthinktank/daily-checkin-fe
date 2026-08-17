import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsService } from '@/api/reports.service'
import { queryKeys } from '../queryKeys'

// Forces a synchronous cache rebuild server-side — for a manual "refresh"
// button, per API_DOCUMENTATION.md §3.4. Normal traffic relies on the
// automatic rebuild-on-write and should just use the plain GET.
export function useRebuildMonthlySummary(patientId: string, month?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reportsService.rebuildMonthlySummary(patientId, month),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.summary.detail(patientId, month), data)
    },
  })
}
