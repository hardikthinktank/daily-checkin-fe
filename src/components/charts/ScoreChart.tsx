import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlySummary } from '@/types/domain'
import { CHART_INK, SCORE_LINE_COLOR } from './chartTheme'
import { format, parseISO } from 'date-fns'
import { EmptyState } from '@/components/ui/EmptyState'

interface ScoreChartProps {
  data: MonthlySummary['scoreChart']['series']
  usualScoreLine: number | null
  usualPlus3Line: number | null
}

export function ScoreChart({ data, usualScoreLine, usualPlus3Line }: ScoreChartProps) {
  if (data.length === 0) {
    return <EmptyState title="No score data this month" />
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
        <YAxis domain={[0, 10]} allowDecimals={false} stroke={CHART_INK.axis} tick={{ fill: CHART_INK.muted, fontSize: 11 }} tickLine={false} />
        <Tooltip
          labelFormatter={(d) => format(parseISO(d as string), 'MMM d, yyyy')}
          contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: CHART_INK.grid }}
        />
        {usualScoreLine !== null && (
          <ReferenceLine
            y={usualScoreLine}
            stroke={CHART_INK.muted}
            strokeDasharray="4 4"
            label={{ value: 'Usual', position: 'insideTopLeft', fill: CHART_INK.secondary, fontSize: 11 }}
          />
        )}
        {usualPlus3Line !== null && (
          <ReferenceLine
            y={Math.min(usualPlus3Line, 10)}
            stroke={CHART_INK.muted}
            strokeDasharray="4 4"
            label={{ value: 'Usual +3', position: 'insideTopLeft', fill: CHART_INK.secondary, fontSize: 11 }}
          />
        )}
        <Line type="monotone" dataKey="todayScore" name="D3 score" stroke={SCORE_LINE_COLOR} strokeWidth={2} dot={{ r: 2.5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
