import { apiClient } from './client'
import type { CallType, Flag, FlagAction, FlagDetail, FlagEvent } from '@/types/domain'

interface FlagWire {
  id: string
  patient_id: string
  rule_code: string
  rule_version: string
  level: Flag['level']
  status: Flag['status']
  first_fired_at: string
  last_fired_at: string
  event_count: number
  why_snapshot: Record<string, unknown>
  acknowledged_by: string | null
  acknowledged_at: string | null
  created_at: string
  updated_at: string
}

interface FlagEventWire {
  id: string
  checkin_id: string | null
  rule_version: string
  fired_at: string
  numbers_snapshot: Record<string, unknown>
}

interface FlagActionWire {
  id: string
  flag_id: string
  actor_id: string
  action_type: FlagAction['actionType']
  minutes: number | null
  call_type: CallType | null
  reason: string | null
  note: string | null
  created_at: string
}

interface FlagDetailWire extends FlagWire {
  rule_description: string
  care_manager_action: string
  events: FlagEventWire[]
  actions: FlagActionWire[]
}

function mapFlag(wire: FlagWire): Flag {
  return {
    id: wire.id,
    patientId: wire.patient_id,
    ruleCode: wire.rule_code,
    ruleVersion: wire.rule_version,
    level: wire.level,
    status: wire.status,
    firstFiredAt: wire.first_fired_at,
    lastFiredAt: wire.last_fired_at,
    eventCount: wire.event_count,
    whySnapshot: wire.why_snapshot,
    acknowledgedBy: wire.acknowledged_by,
    acknowledgedAt: wire.acknowledged_at,
    createdAt: wire.created_at,
    updatedAt: wire.updated_at,
  }
}

function mapEvent(wire: FlagEventWire): FlagEvent {
  return {
    id: wire.id,
    checkinId: wire.checkin_id,
    ruleVersion: wire.rule_version,
    firedAt: wire.fired_at,
    numbersSnapshot: wire.numbers_snapshot,
  }
}

function mapAction(wire: FlagActionWire): FlagAction {
  return {
    id: wire.id,
    flagId: wire.flag_id,
    actorId: wire.actor_id,
    actionType: wire.action_type,
    minutes: wire.minutes,
    callType: wire.call_type,
    reason: wire.reason,
    note: wire.note,
    createdAt: wire.created_at,
  }
}

function mapFlagDetail(wire: FlagDetailWire): FlagDetail {
  return {
    ...mapFlag(wire),
    ruleDescription: wire.rule_description,
    careManagerAction: wire.care_manager_action,
    events: wire.events.map(mapEvent),
    actions: wire.actions.map(mapAction),
  }
}

export const flagsService = {
  // Server-sorted (Critical first, then recency) — render as received.
  workList: async () => (await apiClient.get<FlagWire[]>('/care-manager/worklist')).map(mapFlag),
  get: async (id: string) => mapFlagDetail(await apiClient.get<FlagDetailWire>(`/flags/${id}`)),
  acknowledge: async (id: string, actorId: string) => mapFlag(await apiClient.post<FlagWire>(`/flags/${id}/acknowledge`, { actor_id: actorId })),
  // log-call/escalate/resolve return the new CareActionResponse, not the
  // updated flag — callers should rely on query invalidation to refresh it.
  logCall: async (id: string, entry: { actorId: string; minutes: number; callType: CallType; note?: string }) =>
    mapAction(
      await apiClient.post<FlagActionWire>(`/flags/${id}/log-call`, {
        actor_id: entry.actorId,
        minutes: entry.minutes,
        call_type: entry.callType,
        note: entry.note,
      }),
    ),
  escalate: async (id: string, entry: { actorId: string; reason: string }) =>
    mapAction(await apiClient.post<FlagActionWire>(`/flags/${id}/escalate`, { actor_id: entry.actorId, reason: entry.reason })),
  resolve: async (id: string, entry: { actorId: string; note: string }) =>
    mapAction(await apiClient.post<FlagActionWire>(`/flags/${id}/resolve`, { actor_id: entry.actorId, note: entry.note })),
}
