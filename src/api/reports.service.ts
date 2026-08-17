import { apiClient } from './client'
import type { AdminRow, FlagLevel, MonthlySummary, MonthStripCell, Rule } from '@/types/domain'

interface AdminRowWire {
  patient_id: string
  patient_name: string
  mrn: string
  diagnosis: string
  therapy: string
  month_strip: MonthStripCell[]
  checkins_done: number
  checkins_expected: number
  checkins_pct: number
  average_score: number | null
  last_checkin_date: string | null
  last_checkin_level: FlagLevel | null
  open_items: number
  minutes_this_month: number
  live_call_this_month: boolean
  days_of_data_this_month: number
  sixteen_day_marker_met: boolean
  sixteen_day_marker_short_by: number
}

function mapAdminRow(wire: AdminRowWire): AdminRow {
  return {
    patientId: wire.patient_id,
    patientName: wire.patient_name,
    mrn: wire.mrn,
    diagnosis: wire.diagnosis,
    therapy: wire.therapy,
    monthStrip: wire.month_strip,
    checkinsDone: wire.checkins_done,
    checkinsExpected: wire.checkins_expected,
    checkinsPct: wire.checkins_pct,
    averageScore: wire.average_score,
    lastCheckinDate: wire.last_checkin_date,
    lastCheckinLevel: wire.last_checkin_level,
    openItems: wire.open_items,
    minutesThisMonth: wire.minutes_this_month,
    liveCallThisMonth: wire.live_call_this_month,
    daysOfDataThisMonth: wire.days_of_data_this_month,
    sixteenDayMarkerMet: wire.sixteen_day_marker_met,
    sixteenDayMarkerShortBy: wire.sixteen_day_marker_short_by,
  }
}

interface MonthlySummaryWire {
  header: {
    patient_id: string
    patient_name: string
    month: string
    drug: string
    days_reported: number
    days_in_month: number
  }
  symptom_chart: { date: string; fatigue: number; pain: number; swelling: number }[]
  score_chart: {
    series: { date: string; today_score: number; usual_score: number | null }[]
    usual_score_line: number | null
    usual_plus_3_line: number | null
  }
  days_by_level: Record<string, number>
  month_strip: MonthStripCell[]
  flags_table: {
    rule_code: string
    rule_version: string
    what_fired_it: string
    level: FlagLevel
    first_fired_at: string
    event_count: number
    status: MonthlySummary['flagsTable'][number]['status']
    minutes: number
  }[]
  team_actions: {
    date: string
    action_type: MonthlySummary['teamActions'][number]['actionType']
    minutes: number | null
    call_type: MonthlySummary['teamActions'][number]['callType']
    reason: string | null
    note: string | null
  }[]
  record_facts: {
    days_of_data: number
    sixteen_day_marker_met: boolean
    sixteen_day_marker_short_by: number
    live_call_happened: boolean
    minutes_recorded: number
  }
}

function mapMonthlySummary(wire: MonthlySummaryWire): MonthlySummary {
  return {
    header: {
      patientId: wire.header.patient_id,
      patientName: wire.header.patient_name,
      month: wire.header.month,
      drug: wire.header.drug,
      daysReported: wire.header.days_reported,
      daysInMonth: wire.header.days_in_month,
    },
    symptomChart: wire.symptom_chart,
    scoreChart: {
      series: wire.score_chart.series.map((s) => ({ date: s.date, todayScore: s.today_score, usualScore: s.usual_score })),
      usualScoreLine: wire.score_chart.usual_score_line,
      usualPlus3Line: wire.score_chart.usual_plus_3_line,
    },
    daysByLevel: wire.days_by_level as MonthlySummary['daysByLevel'],
    monthStrip: wire.month_strip,
    flagsTable: wire.flags_table.map((f) => ({
      ruleCode: f.rule_code,
      ruleVersion: f.rule_version,
      whatFiredIt: f.what_fired_it,
      level: f.level,
      firstFiredAt: f.first_fired_at,
      eventCount: f.event_count,
      status: f.status,
      minutes: f.minutes,
    })),
    teamActions: wire.team_actions.map((a) => ({
      date: a.date,
      actionType: a.action_type,
      minutes: a.minutes,
      callType: a.call_type,
      reason: a.reason,
      note: a.note,
    })),
    recordFacts: {
      daysOfData: wire.record_facts.days_of_data,
      sixteenDayMarkerMet: wire.record_facts.sixteen_day_marker_met,
      sixteenDayMarkerShortBy: wire.record_facts.sixteen_day_marker_short_by,
      liveCallHappened: wire.record_facts.live_call_happened,
      minutesRecorded: wire.record_facts.minutes_recorded,
    },
  }
}

interface RuleWire {
  id: string
  rule_code: string
  version: number
  level: FlagLevel
  description: string
  rule_type: string
  params: Record<string, unknown>
  follow_up_questions: Rule['followUpQuestions']
  requires_fever_gate: boolean
  care_manager_action: string
  threshold_source: string
  effective_from: string
  effective_to: string | null
  is_active: boolean
}

function mapRule(wire: RuleWire): Rule {
  return {
    id: wire.id,
    ruleCode: wire.rule_code,
    version: wire.version,
    level: wire.level,
    description: wire.description,
    ruleType: wire.rule_type,
    params: wire.params,
    followUpQuestions: wire.follow_up_questions,
    requiresFeverGate: wire.requires_fever_gate,
    careManagerAction: wire.care_manager_action,
    thresholdSource: wire.threshold_source,
    effectiveFrom: wire.effective_from,
    effectiveTo: wire.effective_to,
    isActive: wire.is_active,
  }
}

export const reportsService = {
  adminRows: async (month?: string) => (await apiClient.get<AdminRowWire[]>('/admin/patients', { month })).map(mapAdminRow),
  monthlySummary: async (patientId: string, month?: string) =>
    mapMonthlySummary(await apiClient.get<MonthlySummaryWire>(`/patients/${patientId}/monthly-summary`, { month })),
  rebuildMonthlySummary: async (patientId: string, month?: string) =>
    mapMonthlySummary(await apiClient.post<MonthlySummaryWire>(`/patients/${patientId}/monthly-summary/rebuild${month ? `?month=${month}` : ''}`)),
  rules: async (activeOnly = true) => (await apiClient.get<RuleWire[]>('/admin/rules', { active_only: activeOnly })).map(mapRule),
}
