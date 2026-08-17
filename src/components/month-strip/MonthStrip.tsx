import type { MonthStripCell } from '@/types/domain'
import { monthStripLevelClasses, FLAG_LEVEL_LABEL } from '@/lib/flagLevel'
import { cn } from '@/lib/cn'

interface MonthStripProps {
  days: MonthStripCell[]
  size?: 'sm' | 'md'
}

export function MonthStrip({ days, size = 'sm' }: MonthStripProps) {
  const cellSize = size === 'sm' ? 'h-2.5 w-2.5' : 'h-4 w-4'
  return (
    <div className="flex flex-wrap gap-0.5" role="img" aria-label="Month strip of daily flag levels">
      {days.map((cell) => (
        <span
          key={cell.day}
          title={`Day ${cell.day} — ${cell.level ? FLAG_LEVEL_LABEL[cell.level] : 'No check-in / nothing fired'}`}
          className={cn('rounded-[2px]', cellSize, monthStripLevelClasses(cell.level))}
        />
      ))}
    </div>
  )
}

export function MonthStripLegend() {
  const items: { label: string; className: string }[] = [
    { label: 'No check-in / nothing fired', className: 'bg-slate-100' },
    { label: 'Note', className: 'bg-level-note' },
    { label: 'Review', className: 'bg-level-review' },
    { label: 'Urgent', className: 'bg-level-urgent' },
    { label: 'Critical', className: 'bg-level-critical' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span className={cn('h-2.5 w-2.5 rounded-[2px]', item.className)} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
