import { useState } from 'react'
import type { FollowUpAnswerValue, FollowUpAnswers, FollowUpQuestionId } from '@/types/domain'
import { FOLLOW_UP_QUESTIONS } from '@/config/followUpQuestions'
import { ChoiceGroup } from '@/components/ui/ChoiceGroup'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

interface FollowUpFormProps {
  questionIds: FollowUpQuestionId[]
  onSubmit: (answers: FollowUpAnswers) => void
  isSubmitting: boolean
}

const SKIPPED = 'skipped'

export function FollowUpForm({ questionIds, onSubmit, isSubmitting }: FollowUpFormProps) {
  const [answers, setAnswers] = useState<Partial<Record<FollowUpQuestionId, FollowUpAnswerValue>>>({})

  function setAnswer(id: FollowUpQuestionId, value: FollowUpAnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function skip(id: FollowUpQuestionId) {
    setAnswers((prev) => ({ ...prev, [id]: SKIPPED }))
  }

  function handleSubmit() {
    const full: FollowUpAnswers = {}
    for (const id of questionIds) {
      full[id] = answers[id] ?? SKIPPED
    }
    onSubmit(full)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">A couple more questions based on today's answers. You can skip any of them.</p>
      {questionIds.map((id) => {
        const def = FOLLOW_UP_QUESTIONS[id]
        const current = answers[id]
        const isSkipped = current === SKIPPED
        return (
          <Card key={id}>
            <CardBody className="space-y-3">
              <p className="text-sm font-medium text-slate-900">{def.wording}</p>
              <ChoiceGroup
                name={def.label}
                choices={def.choices}
                multiSelect={def.multiSelect}
                value={isSkipped ? undefined : current}
                onChange={(value) => setAnswer(id, value)}
              />
              <button
                type="button"
                onClick={() => skip(id)}
                className={cn(
                  'cursor-pointer text-xs font-medium underline-offset-2 hover:underline',
                  isSkipped ? 'text-slate-900' : 'text-slate-400',
                )}
              >
                {isSkipped ? 'Skipped' : 'Skip this question'}
              </button>
            </CardBody>
          </Card>
        )
      })}
      <Button onClick={handleSubmit} loading={isSubmitting} className="w-full sm:w-auto">
        Continue
      </Button>
    </div>
  )
}
