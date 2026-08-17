import { cn } from '@/lib/cn'

interface Choice {
  value: string
  label: string
}

interface ChoiceGroupProps {
  choices: Choice[]
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
  multiSelect?: boolean
  name: string
}

export function ChoiceGroup({ choices, value, onChange, multiSelect, name }: ChoiceGroupProps) {
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : [])

  function toggle(choiceValue: string) {
    if (multiSelect) {
      const next = new Set(selected)
      if (next.has(choiceValue)) next.delete(choiceValue)
      else next.add(choiceValue)
      onChange(Array.from(next))
    } else {
      onChange(choiceValue)
    }
  }

  return (
    <div role={multiSelect ? 'group' : 'radiogroup'} aria-label={name} className="flex flex-wrap gap-2">
      {choices.map((choice) => {
        const isSelected = selected.has(choice.value)
        return (
          <button
            key={choice.value}
            type="button"
            role={multiSelect ? 'checkbox' : 'radio'}
            aria-checked={isSelected}
            onClick={() => toggle(choice.value)}
            className={cn(
              'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400',
            )}
          >
            {choice.label}
          </button>
        )
      })}
    </div>
  )
}
