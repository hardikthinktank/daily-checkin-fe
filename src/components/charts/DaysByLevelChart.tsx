import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlySummary } from '@/types/domain'
import { CHART_INK } from './chartTheme'
import { FLAG_LEVEL_LABEL } from '@/lib/flagLevel'

// Same hex values as the --color-level-* theme tokens (index.css), kept in
// sync so the chart's bars match the badges/month-strip elsewhere.
const LEVEL_HEX = {
  Note: '#475569',
  Review: '#b45309',
  Urgent: '#c2410c',
  Critical: '#b91c1c',
}

export function DaysByLevelChart({ daysByLevel }: { daysByLevel: MonthlySummary['daysByLevel'] }) {
  const data = (['Note', 'Review', 'Urgent', 'Critical'] as const).map((level) => ({
    level,
    label: FLAG_LEVEL_LABEL[level],
    days: daysByLevel[level],
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
        <XAxis dataKey="label" stroke={CHART_INK.axis} tick={{ fill: CHART_INK.secondary, fontSize: 12 }} tickLine={false} />
        <YAxis allowDecimals={false} stroke={CHART_INK.axis} tick={{ fill: CHART_INK.muted, fontSize: 11 }} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: CHART_INK.grid }} formatter={(value) => [`${value} days`, '']} />
        <Bar dataKey="days" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.level} fill={LEVEL_HEX[entry.level]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
