// Mirrors the real backend's response shapes (see API_DOCUMENTATION.md).
// Field names are camelCase here; each api/*.service.ts function maps the
// wire's snake_case JSON into these. Enum *values* are kept verbatim (e.g.
// FlagLevel's capitalization) since they're real wire contracts, not ours to
// restyle.

export type FlagLevel = 'Note' | 'Review' | 'Urgent' | 'Critical'

export type FlagStatus = 'open' | 'acknowledged' | 'escalated' | 'resolved'

export type ActorType = 'human' | 'system'
export type ActorRole = 'patient' | 'care_manager' | 'physician' | 'admin' | 'system'

export interface Actor {
  id: string
  displayName: string
  actorType: ActorType
  role: ActorRole
}

export type ActorInput = Omit<Actor, 'id'>

export interface Drug {
  id: string
  name: string
  isBiologicOrSimilar: boolean
}

export type DrugInput = Omit<Drug, 'id'>

export interface Patient {
  id: string
  name: string
  mrn: string
  diagnosis: string
  currentDrug: Drug
  enrollmentDate: string
}

export interface PatientInput {
  name: string
  mrn: string
  diagnosis: string
  currentDrugId: string
}

export type FollowUpQuestionId =
  | 'days_at_level'
  | 'new_joint'
  | 'which_joints'
  | 'morning_stiffness'
  | 'sleep'
  | 'medication'
  | 'reason'
  | 'fever'

// Real answers are plain values — "skipped" is a literal string, not a
// wrapper object, and which_joints is the one array-valued field.
export type FollowUpAnswerValue = string | string[]
export type FollowUpAnswers = Partial<Record<FollowUpQuestionId, FollowUpAnswerValue>>

export interface CheckIn {
  id: string
  patientId: string
  checkinDate: string
  fatigue: number
  pain: number
  swelling: number
  todayScore: number
  usualScore: number | null
  change: number | null
  followUpAnswers: FollowUpAnswers
  version: number
  isCurrent: boolean
  submittedAt: string
  requiredFollowUps: FollowUpQuestionId[]
  dayLevel: FlagLevel | null
  created: boolean
}

export type CareActionType = 'acknowledge' | 'log_call' | 'escalate' | 'resolve'
export type CallType = 'phone' | 'video' | 'async_message'

export interface FlagEvent {
  id: string
  checkinId: string | null
  ruleVersion: string
  firedAt: string
  numbersSnapshot: Record<string, unknown>
}

export interface FlagAction {
  id: string
  flagId: string
  actorId: string
  actionType: CareActionType
  minutes: number | null
  callType: CallType | null
  reason: string | null
  note: string | null
  createdAt: string
}

export interface Flag {
  id: string
  patientId: string
  ruleCode: string
  ruleVersion: string
  level: FlagLevel
  status: FlagStatus
  firstFiredAt: string
  lastFiredAt: string
  eventCount: number
  whySnapshot: Record<string, unknown>
  acknowledgedBy: string | null
  acknowledgedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface FlagDetail extends Flag {
  ruleDescription: string
  careManagerAction: string
  events: FlagEvent[]
  actions: FlagAction[]
}

export interface MonthStripCell {
  day: number
  level: FlagLevel | null
}

export interface AdminRow {
  patientId: string
  patientName: string
  mrn: string
  diagnosis: string
  therapy: string
  monthStrip: MonthStripCell[]
  checkinsDone: number
  checkinsExpected: number
  checkinsPct: number
  averageScore: number | null
  lastCheckinDate: string | null
  lastCheckinLevel: FlagLevel | null
  openItems: number
  minutesThisMonth: number
  liveCallThisMonth: boolean
  daysOfDataThisMonth: number
  sixteenDayMarkerMet: boolean
  sixteenDayMarkerShortBy: number
}

export interface MonthlySummaryFlagRow {
  ruleCode: string
  ruleVersion: string
  whatFiredIt: string
  level: FlagLevel
  firstFiredAt: string
  eventCount: number
  status: FlagStatus
  minutes: number
}

export interface MonthlySummary {
  header: {
    patientId: string
    patientName: string
    month: string
    drug: string
    daysReported: number
    daysInMonth: number
  }
  symptomChart: { date: string; fatigue: number; pain: number; swelling: number }[]
  scoreChart: {
    series: { date: string; todayScore: number; usualScore: number | null }[]
    usualScoreLine: number | null
    usualPlus3Line: number | null
  }
  daysByLevel: Record<FlagLevel | 'none', number>
  monthStrip: MonthStripCell[]
  flagsTable: MonthlySummaryFlagRow[]
  teamActions: {
    date: string
    actionType: CareActionType
    minutes: number | null
    callType: CallType | null
    reason: string | null
    note: string | null
  }[]
  recordFacts: {
    daysOfData: number
    sixteenDayMarkerMet: boolean
    sixteenDayMarkerShortBy: number
    liveCallHappened: boolean
    minutesRecorded: number
  }
}

export interface Rule {
  id: string
  ruleCode: string
  version: number
  level: FlagLevel
  description: string
  ruleType: string
  params: Record<string, unknown>
  followUpQuestions: FollowUpQuestionId[]
  requiresFeverGate: boolean
  careManagerAction: string
  thresholdSource: string
  effectiveFrom: string
  effectiveTo: string | null
  isActive: boolean
}

export type Persona = 'patient' | 'care-manager' | 'admin' | 'physician'
