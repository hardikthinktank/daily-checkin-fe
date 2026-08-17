import type { MonthlySummary } from '@/types/domain'
import { formatMonthLabel } from '@/utils/date'

// The API's monthly-summary response doesn't include the patient's MRN, so
// the caller looks it up from the already-loaded patient list and passes it
// through — keeps "name (MRN)" consistent everywhere without a second fetch.
export function SummaryHeader({ summary, mrn }: { summary: MonthlySummary; mrn?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-slate-200 pb-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {summary.header.patientName}
          {mrn && ` (${mrn})`}
        </h1>
        <p className="text-sm text-slate-500">{summary.header.drug}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">{formatMonthLabel(summary.header.month)}</p>
        <p className="text-sm text-slate-500">
          {summary.header.daysReported} of {summary.header.daysInMonth} days reported
        </p>
      </div>
    </div>
  )
}
