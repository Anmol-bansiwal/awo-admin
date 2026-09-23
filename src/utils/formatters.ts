/**
 * Centralized formatting utilities for dates, currency, numbers, and strings.
 */

/**
 * Formats an ISO string or Date into standard readable date format (e.g., "Sep 15, 2026").
 */
export function formatDate(
  dateInput?: string | number | Date | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(
      'en-US',
      options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    );
  } catch {
    return '—';
  }
}

/**
 * Formats an ISO string or Date into date with time (e.g., "Sep 15, 2026, 08:30 AM").
 */
export function formatDateTime(
  dateInput?: string | number | Date | null
): string {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Formats a numeric currency value (e.g., $1,250.00).
 */
export function formatCurrency(
  amount?: number | string | null,
  currency = 'USD'
): string {
  if (amount === undefined || amount === null || amount === '') return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}
