import { format, eachDayOfInterval, endOfMonth, startOfMonth, subDays, parseISO, differenceInCalendarDays } from 'date-fns'

export const ISO_DATE = 'yyyy-MM-dd'

export function toISODate(date: Date): string {
  return format(date, ISO_DATE)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function isoDaysAgo(days: number, from: Date = new Date()): string {
  return toISODate(subDays(from, days))
}

export function monthKey(date: Date = new Date()): string {
  return format(date, 'yyyy-MM')
}

// The API takes month params as a full date, any day within the target month.
export function toApiMonthParam(monthKeyValue: string): string {
  return `${monthKeyValue}-01`
}

export function daysInMonth(monthStr: string): string[] {
  const anchor = parseISO(`${monthStr}-01`)
  return eachDayOfInterval({ start: startOfMonth(anchor), end: endOfMonth(anchor) }).map(toISODate)
}

export function daysSince(dateISO: string, from: Date = new Date()): number {
  return differenceInCalendarDays(from, parseISO(dateISO))
}

export function formatDisplayDate(dateISO: string): string {
  return format(parseISO(dateISO), 'MMM d, yyyy')
}

export function formatDisplayDateTime(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy \'at\' h:mm a')
}

// Accepts either a 'yyyy-MM' picker value or a full 'yyyy-MM-dd' date (e.g.
// from the API's header.month) — normalizes either into a display label.
export function formatMonthLabel(month: string): string {
  const normalized = month.split('-').length === 3 ? month : `${month}-01`
  return format(parseISO(normalized), 'MMMM yyyy')
}
