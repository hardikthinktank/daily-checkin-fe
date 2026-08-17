export function round1(value: number): number {
  return Math.round(value * 10) / 10
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? round1((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid]
}

export function todayScore(fatigue: number, pain: number, swelling: number): number {
  return round1((fatigue + pain + swelling) / 3)
}
