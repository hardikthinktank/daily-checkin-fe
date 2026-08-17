import { apiClient } from './client'
import type { CheckIn, FollowUpAnswers, FollowUpQuestionId } from '@/types/domain'

interface CheckinWire {
  id: string
  patient_id: string
  checkin_date: string
  fatigue: number
  pain: number
  swelling: number
  today_score: number
  usual_score: number | null
  change: number | null
  follow_up_answers: FollowUpAnswers
  version: number
  is_current: boolean
  submitted_at: string
  required_followups: FollowUpQuestionId[]
  day_level: CheckIn['dayLevel']
  created: boolean
}

function mapCheckIn(wire: CheckinWire): CheckIn {
  return {
    id: wire.id,
    patientId: wire.patient_id,
    checkinDate: wire.checkin_date,
    fatigue: wire.fatigue,
    pain: wire.pain,
    swelling: wire.swelling,
    todayScore: wire.today_score,
    usualScore: wire.usual_score,
    change: wire.change,
    // follow_up_answers keys are already the same snake_case question codes
    // this app uses as FollowUpQuestionId, so no key remapping needed.
    followUpAnswers: wire.follow_up_answers,
    version: wire.version,
    isCurrent: wire.is_current,
    submittedAt: wire.submitted_at,
    requiredFollowUps: wire.required_followups,
    dayLevel: wire.day_level,
    created: wire.created,
  }
}

export interface SubmitCheckInPayload {
  patientId: string
  submissionId: string
  fatigue: number
  pain: number
  swelling: number
}

export const checkInsService = {
  submit: async (payload: SubmitCheckInPayload) =>
    mapCheckIn(
      await apiClient.post<CheckinWire>(`/patients/${payload.patientId}/checkins`, {
        client_submission_id: payload.submissionId,
        fatigue: payload.fatigue,
        pain: payload.pain,
        swelling: payload.swelling,
      }),
    ),
  submitFollowUps: async (checkInId: string, answers: FollowUpAnswers) =>
    mapCheckIn(await apiClient.post<CheckinWire>(`/checkins/${checkInId}/followups`, answers)),
}
