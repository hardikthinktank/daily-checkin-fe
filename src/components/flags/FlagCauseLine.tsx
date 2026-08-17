import type { Flag, FlagDetail } from '@/types/domain'
import { formatWhySnapshot } from '@/lib/formatWhySnapshot'

function hasRuleDescription(flag: Flag | FlagDetail): flag is FlagDetail {
  return 'ruleDescription' in flag
}

// PRD section 8: "A care manager must never see a flag whose cause they
// cannot inspect." Every place a flag is shown, this is what backs that up —
// rule id, version, and the actual numbers, not just the level. The flag
// detail response includes the human rule sentence (ruleDescription); the
// worklist row doesn't, so it falls back to a formatted why_snapshot.
export function FlagCauseLine({ flag, className }: { flag: Flag | FlagDetail; className?: string }) {
  const cause = hasRuleDescription(flag) ? flag.ruleDescription : formatWhySnapshot(flag.whySnapshot)
  return (
    <p className={className}>
      <span className="font-mono text-xs text-slate-500">
        {flag.ruleCode} v{flag.ruleVersion}
      </span>
      <span className="mx-1.5 text-slate-300">·</span>
      <span className="text-sm text-slate-700">{cause}</span>
    </p>
  )
}
