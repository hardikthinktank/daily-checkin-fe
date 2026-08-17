import type { MonthlySummary } from '@/types/domain'

export function RecordFacts({ facts }: { facts: MonthlySummary['recordFacts'] }) {
  const items = [
    { label: 'Days of data', value: `${facts.daysOfData}` },
    { label: '16-day marker', value: facts.sixteenDayMarkerMet ? 'Reached' : `Short by ${facts.sixteenDayMarkerShortBy}` },
    { label: 'Live call this month', value: facts.liveCallHappened ? 'Yes' : 'No' },
    { label: 'Minutes recorded', value: `${facts.minutesRecorded}` },
  ]

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-slate-200 px-3 py-2.5">
          <dt className="text-xs text-slate-500">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
