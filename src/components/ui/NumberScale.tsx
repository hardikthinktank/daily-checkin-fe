import { cn } from '@/lib/cn'

interface NumberScaleProps {
  value: number | undefined
  onChange: (value: number) => void
  name: string
  lowLabel: string
  highLabel: string
}

export function NumberScale({ value, onChange, name, lowLabel, highLabel }: NumberScaleProps) {
  return (
    <div>
      <div role="radiogroup" aria-label={name} className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={cn(
              'flex h-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors',
              value === n
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400',
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}
