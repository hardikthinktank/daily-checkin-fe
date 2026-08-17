// Flag events carry a rule_type-specific `why_snapshot`/`numbers_snapshot`
// object (see API_DOCUMENTATION.md §5 for the rule_type -> params table) —
// there's no single fixed shape across rule types, so this renders whatever
// keys are present rather than assuming one schema.
function humanizeKey(key: string): string {
  return key.replace(/_/g, ' ')
}

export function formatWhySnapshot(snapshot: Record<string, unknown>): string {
  const entries = Object.entries(snapshot)
  if (entries.length === 0) return ''

  // threshold_gte / any_field_gte-shaped: {field, value, gte}
  if ('field' in snapshot && 'value' in snapshot && 'gte' in snapshot) {
    return `${humanizeKey(String(snapshot.field))} ${snapshot.value} (≥ ${snapshot.gte})`
  }
  // answer_equals-shaped: {field, value, equals}
  if ('field' in snapshot && 'value' in snapshot && 'equals' in snapshot) {
    return `${humanizeKey(String(snapshot.field))}: ${snapshot.value}`
  }

  return entries.map(([key, value]) => `${humanizeKey(key)}: ${Array.isArray(value) ? value.join(', ') : value}`).join(', ')
}
