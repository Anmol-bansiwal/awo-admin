/**
 * Shared Finance Formatting Utilities
 */
import { formatDateTime } from '../../../utils/formatters';

/**
 * Formats a monetary amount into a clean localized currency string.
 * Uses currency provided from backend, or formatted number with clean fallback.
 */
export const formatMoney = (
  amount?: number | null,
  currency?: string | null
): string => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '—';
  }

  const numericAmount = Number(amount);
  const resolvedCurrency = (currency || 'USD').toUpperCase();

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: resolvedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    // If the currency code is non-standard or custom
    return `${resolvedCurrency} ${numericAmount.toFixed(2)}`;
  }
};

/**
 * Formats ISO date string into readable Date & Time.
 */
export const formatFinanceDate = formatDateTime;

/**
 * Formats machine readable transaction types into human friendly titles.
 */
export const formatTransactionType = (type?: string | null): string => {
  if (!type) return 'Transaction';
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
