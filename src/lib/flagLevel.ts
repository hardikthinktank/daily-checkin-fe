import type { FlagLevel } from '@/types/domain'

export const FLAG_LEVEL_LABEL: Record<FlagLevel, string> = {
  Note: 'Note',
  Review: 'Review',
  Urgent: 'Urgent',
  Critical: 'Critical',
}

export const FLAG_LEVEL_RANK: Record<FlagLevel, number> = {
  Note: 0,
  Review: 1,
  Urgent: 2,
  Critical: 3,
}

// Literal Tailwind class names (not built dynamically) so the JIT scanner can
// find them — this is the one place the level -> color mapping lives.
export const FLAG_LEVEL_CLASSES: Record<FlagLevel, { text: string; bg: string; border: string; solidBg: string }> = {
  Note: { text: 'text-level-note', bg: 'bg-level-note-soft', border: 'border-level-note-border', solidBg: 'bg-level-note' },
  Review: { text: 'text-level-review', bg: 'bg-level-review-soft', border: 'border-level-review-border', solidBg: 'bg-level-review' },
  Urgent: { text: 'text-level-urgent', bg: 'bg-level-urgent-soft', border: 'border-level-urgent-border', solidBg: 'bg-level-urgent' },
  Critical: { text: 'text-level-critical', bg: 'bg-level-critical-soft', border: 'border-level-critical-border', solidBg: 'bg-level-critical' },
}

// The API's month_strip cells can't distinguish "no check-in" from "checked
// in, nothing fired" (both are level: null, and there's no per-day date list
// to reconstruct the difference from) — so this is a 2-state, not 3-state,
// mapping: blank or a level color.
export function monthStripLevelClasses(level: FlagLevel | null): string {
  if (level === null) return 'bg-slate-100'
  return FLAG_LEVEL_CLASSES[level].solidBg
}
