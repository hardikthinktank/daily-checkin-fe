import type { FlagLevel } from '@/types/domain'
import { FLAG_LEVEL_CLASSES, FLAG_LEVEL_LABEL } from '@/lib/flagLevel'
import { cn } from '@/lib/cn'

export function FlagLevelBadge({ level, size = 'md' }: { level: FlagLevel; size?: 'sm' | 'md' }) {
  const classes = FLAG_LEVEL_CLASSES[level]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        classes.bg,
        classes.text,
        classes.border,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', classes.solidBg)} aria-hidden="true" />
      {FLAG_LEVEL_LABEL[level]}
    </span>
  )
}
