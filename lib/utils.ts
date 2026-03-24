import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a dollar amount for display.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format an ISO date string to a locale date.
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Entity type labels for display.
 */
export const ENTITY_TYPE_LABELS: Record<string, string> = {
  '1040': 'Individual (1040)',
  '1120': 'C-Corp (1120)',
  '1120s': 'S-Corp (1120-S)',
  '1065': 'Partnership (1065)',
  '1041': 'Trust/Estate (1041)',
}

export function getEntityLabel(entityType: string | null): string {
  if (!entityType) return 'Unknown'
  return ENTITY_TYPE_LABELS[entityType] ?? entityType.toUpperCase()
}
