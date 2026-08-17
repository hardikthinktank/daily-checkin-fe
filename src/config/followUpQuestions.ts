import type { FollowUpQuestionId } from '@/types/domain'

export interface FollowUpQuestionDef {
  id: FollowUpQuestionId
  label: string
  wording: string
  choices: { value: string; label: string }[]
  multiSelect?: boolean
}

// Wording per the PRD (section 6); choice *values* must match the backend's
// exact enum strings (API_DOCUMENTATION.md §2) since they're validated
// server-side (422 invalid_followup_answer) — not slugs of our choosing.
// No free typing on any of these — every answer is a button.
export const FOLLOW_UP_QUESTIONS: Record<FollowUpQuestionId, FollowUpQuestionDef> = {
  days_at_level: {
    id: 'days_at_level',
    label: 'Days at this level',
    wording: 'How many days has the pain been at this level?',
    choices: [
      { value: '1', label: '1' },
      { value: '2-3', label: '2–3' },
      { value: '4-7', label: '4–7' },
      { value: 'more than 7', label: 'More than 7' },
    ],
  },
  new_joint: {
    id: 'new_joint',
    label: 'New joint',
    wording: "Is a new joint involved that wasn't before?",
    choices: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not sure', label: 'Not sure' },
    ],
  },
  which_joints: {
    id: 'which_joints',
    label: 'Which joints',
    wording: 'Which joints are swollen today?',
    multiSelect: true,
    choices: [
      { value: 'hands', label: 'Hands' },
      { value: 'wrists', label: 'Wrists' },
      { value: 'elbows', label: 'Elbows' },
      { value: 'shoulders', label: 'Shoulders' },
      { value: 'knees', label: 'Knees' },
      { value: 'ankles', label: 'Ankles' },
      { value: 'feet', label: 'Feet' },
    ],
  },
  morning_stiffness: {
    id: 'morning_stiffness',
    label: 'Morning stiffness',
    wording: 'How long did morning stiffness last today?',
    choices: [
      { value: 'under 30 min', label: 'Under 30 min' },
      { value: '30-60 min', label: '30–60 min' },
      { value: 'over 60 min', label: 'Over 60 min' },
    ],
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep',
    wording: 'How has your sleep been this week?',
    choices: [
      { value: 'fine', label: 'Fine' },
      { value: 'broken', label: 'Broken' },
      { value: 'poor most nights', label: 'Poor most nights' },
    ],
  },
  medication: {
    id: 'medication',
    label: 'Medication',
    wording: 'Did you take your medication as prescribed this week?',
    choices: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  reason: {
    id: 'reason',
    label: 'Reason',
    wording: 'What got in the way?',
    choices: [
      { value: 'cost', label: 'Cost' },
      { value: 'side effects', label: 'Side effects' },
      { value: 'forgot', label: 'Forgot' },
      { value: 'ran out', label: 'Ran out' },
      { value: 'other', label: 'Other' },
    ],
  },
  fever: {
    id: 'fever',
    label: 'Fever',
    wording: 'Have you had a fever or felt feverish in the last 24 hours?',
    choices: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
}
