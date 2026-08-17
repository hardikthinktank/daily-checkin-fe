import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900',
      'focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
