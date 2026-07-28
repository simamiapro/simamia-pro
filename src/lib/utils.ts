import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Tanzanian Shillings (TZS)
 * e.g. 150000 → "TZS 150,000"
 */
export function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString('en-TZ')}`
}

/**
 * Format a date string as "DD MMM YYYY"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Get the day-of-month ordinal string: 1 → "1st", 2 → "2nd", etc.
 */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Calculate days until a given date string (e.g. YYYY-MM-DD).
 * Returns negative for past, 0 for today, positive for future.
 */
export function daysUntilDate(dateStr: string | null | undefined): number {
  if (!dateStr) return 9999
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const targetDate = new Date(dateStr)
  targetDate.setHours(0, 0, 0, 0)

  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((targetDate.getTime() - today.getTime()) / msPerDay)
}

/**
 * Get the contract status color class based on days until due
 */
export function getContractStatusColor(
  daysUntil: number,
  t: { due_soon: string; days: string; today: string; overdue: string }
): {
  badge: string
  label: string
} {
  if (daysUntil < 0) return { badge: 'bg-red-500/20 text-red-400 border-red-500/30', label: `${t.overdue} ${Math.abs(daysUntil)} ${t.days}` }
  if (daysUntil === 0) return { badge: 'bg-red-500/20 text-red-400 border-red-500/30', label: t.today }
  if (daysUntil <= 5) return { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: `${t.due_soon} ${daysUntil} ${t.days}` }
  return { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: `${t.due_soon} ${daysUntil} ${t.days}` }
}

/**
 * Calculate SMS credit cost for a message
 */
export function calculateSmsCost(charCount: number): number {
  if (charCount <= 0) return 0
  if (charCount <= 160) return 1
  return 2
}

/**
 * Truncate a string to maxLength with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}
