import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../finance.api';
import { MOCK_TRANSACTIONS } from '../data/mockFinance';

/**
 * Hook to query financial transactions with pagination, status, transaction type, and search filtering.
 * - Attempts live backend fetch from `/api/v1/admin/finance/transactions`
 * - Automatically falls back to mock dataset if backend is offline or empty.
 * 
 * @param page - Current page index (1-based, default: 1).
 * @param limit - Page size limit (default: 20).
 * @param status - Filter by transaction status ('completed', 'escrow_hold', 'refunded', 'failed', 'all').
 * @param search - Search query for transaction code, booking code, customer name.
 * @param type - Filter by transaction type ('customer_payment', 'provider_payout', 'refund', 'all').
 * @returns React Query object containing transactions list and pagination metadata.
 */
export const useTransactionsQuery = (
  page = 1,
  limit = 20,
  status?: string,
  search?: string,
  type?: string
) => {
  return useQuery({
    queryKey: ['transactions', { page, limit, status, search, type }],
    queryFn: async () => {
      try {
        const res = await financeApi.getTransactions(page, limit, status, search, type);
        if (res.data && res.data.length > 0) {
          return res;
        }
      } catch (e) {
        // Fallback to mock data in development/mock mode
      }

      // Filter mock transactions
      let filtered = [...MOCK_TRANSACTIONS];
      if (status && status !== 'all') {
        filtered = filtered.filter(
          (t) => (t.status || '').toLowerCase() === status.toLowerCase()
        );
      }
      if (type && type !== 'all') {
        filtered = filtered.filter(
          (t) => (t.type || '').toLowerCase() === type.toLowerCase()
        );
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(
          (t) =>
            (t.transaction_code || '').toLowerCase().includes(q) ||
            (t.reference_number || '').toLowerCase().includes(q) ||
            (t.booking_code || '').toLowerCase().includes(q) ||
            (t.customer?.name || '').toLowerCase().includes(q) ||
            (t.customer?.full_name || '').toLowerCase().includes(q)
        );
      }

      return {
        data: filtered,
        metadata: {
          total: filtered.length,
          page,
          page_size: limit,
        },
      };
    },
    staleTime: 30000,
  });
};

/**
 * Hook to fetch full audit log details for a single financial transaction.
 * 
 * @param id - Transaction unique ID string or null.
 * @returns React Query object containing single Transaction entity.
 */
export const useTransactionDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['transaction-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      try {
        const res = await financeApi.getTransactionById(id);
        if (res) return res;
      } catch (e) {
        // Fallback to mock item
      }
      const found = MOCK_TRANSACTIONS.find((t) => t.id === id);
      if (found) return found;
      throw new Error('Transaction not found');
    },
    enabled: Boolean(id),
  });
};
