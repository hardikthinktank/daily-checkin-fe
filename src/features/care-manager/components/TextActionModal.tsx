import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { InlineError } from '@/components/ui/ErrorState'

interface TextActionModalProps {
  open: boolean
  onClose: () => void
  title: string
  label: string
  placeholder?: string
  confirmLabel: string
  variant?: 'primary' | 'danger'
  onSubmit: (text: string) => Promise<void>
  isSubmitting: boolean
}

// Shared shape for Escalate (reason) and Resolve (note) — both are a single
// required free-text field, care-manager-facing documentation rather than
// the button-only patient follow-ups, so free text is appropriate here.
export function TextActionModal({
  open,
  onClose,
  title,
  label,
  placeholder,
  confirmLabel,
  variant = 'primary',
  onSubmit,
  isSubmitting,
}: TextActionModalProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string>()

  async function handleSubmit() {
    if (!text.trim()) {
      setError('This field is required.')
      return
    }
    setError(undefined)
    await onSubmit(text.trim())
    setText('')
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <Field label={label} htmlFor="action-text" required>
          <textarea
            id="action-text"
            rows={3}
            value={text}
            placeholder={placeholder}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </Field>
        {error && <InlineError message={error} />}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant={variant} onClick={handleSubmit} loading={isSubmitting}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
