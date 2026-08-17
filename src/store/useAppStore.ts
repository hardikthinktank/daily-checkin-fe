import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Persona } from '@/types/domain'

interface AppState {
  persona: Persona
  setPersona: (persona: Persona) => void
  actingPatientId: string
  setActingPatientId: (id: string) => void
  actorId: string
  setActorId: (id: string) => void
}

// There's no real login in this API (see API_DOCUMENTATION.md §0 — "no auth,
// no tokens"), so this store stands in for "who am I": which persona's
// screens are showing, which patient the Patient app is acting as, and which
// actor is performing care-manager actions. IDs are real UUIDs from the
// backend, not guaranteed to exist on first load — PatientCheckInPage/
// ActorSwitcher self-heal an unknown id once the real list loads. Persisted
// to localStorage purely so a refresh doesn't drop the demo context.
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      persona: 'patient',
      setPersona: (persona) => set({ persona }),
      actingPatientId: '',
      setActingPatientId: (id) => set({ actingPatientId: id }),
      actorId: '',
      setActorId: (id) => set({ actorId: id }),
    }),
    { name: 'daily-checkin-demo-app-state' },
  ),
)
