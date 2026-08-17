import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlySummary } from '@/types/domain'
import { CHART_INK, SYMPTOM_SERIES_COLORS } from './chartTheme'
import { format, parseISO } from 'date-fns'
import { EmptyState } from '@/components/ui/EmptyState'

export function SymptomChart({ data }: { data: MonthlySummary['symptomChart'] }) {
  if (data.length === 0) {
    return <EmptyState title="No check-ins this month" description="Symptom trends will appear once check-ins come in." />
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'd')}
          stroke={CHART_INK.axis}
          tick={{ fill: CHART_INK.muted, fontSize: 11 }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 10]}
          allowDecimals={false}
          stroke={CHART_INK.axis}
          tick={{ fill: CHART_INK.muted, fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip
          labelFormatter={(d) => format(parseISO(d as string), 'MMM d, yyyy')}
          contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: CHART_INK.grid }}
        />
        <Legend
          verticalAlign="top"
          height={28}
          formatter={(value) => <span style={{ color: CHART_INK.secondary, fontSize: 12 }}>{value}</span>}
        />
        <Line type="monotone" dataKey="fatigue" name="Fatigue" stroke={SYMPTOM_SERIES_COLORS.fatigue} strokeWidth={2} dot={{ r: 2.5 }} />
        <Line type="monotone" dataKey="pain" name="Pain" stroke={SYMPTOM_SERIES_COLORS.pain} strokeWidth={2} dot={{ r: 2.5 }} />
        <Line
          type="monotone"
          dataKey="swelling"
          name="Swelling"
          stroke={SYMPTOM_SERIES_COLORS.swelling}
          strokeWidth={2}
          dot={{ r: 2.5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
