import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ChoiceGroup } from '@/components/ui/ChoiceGroup'
import { InlineError } from '@/components/ui/ErrorState'
import type { CallType } from '@/types/domain'

interface LogCallModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (entry: { minutes: number; callType: CallType; note?: string }) => Promise<void>
  isSubmitting: boolean
}

const CALL_TYPE_CHOICES: { value: CallType; label: string }[] = [
  { value: 'phone', label: 'Phone (live)' },
  { value: 'video', label: 'Video (live)' },
  { value: 'async_message', label: 'Async message' },
]

export function LogCallModal({ open, onClose, onSubmit, isSubmitting }: LogCallModalProps) {
  const [minutes, setMinutes] = useState('')
  const [callType, setCallType] = useState<CallType>('phone')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string>()

  async function handleSubmit() {
    const parsed = Number(minutes)
    if (minutes === '' || !Number.isInteger(parsed) || parsed < 0) {
      setError('Enter minutes as a whole number, 0 or more.')
      return
    }
    setError(undefined)
    await onSubmit({ minutes: parsed, callType, note: note.trim() || undefined })
    setMinutes('')
    setCallType('phone')
    setNote('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Log a call">
      <div className="space-y-4">
        <Field label="Minutes" htmlFor="call-minutes" required>
          <Input id="call-minutes" type="number" min={0} step={1} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </Field>
        <Field label="Type" required>
          <ChoiceGroup name="Call type" choices={CALL_TYPE_CHOICES} value={callType} onChange={(v) => setCallType(v as CallType)} />
        </Field>
        <Field label="Note" htmlFor="call-note">
          <textarea
            id="call-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </Field>
        {error && <InlineError message={error} />}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}
