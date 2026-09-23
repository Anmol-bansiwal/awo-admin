import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../finance.api';
import { MOCK_REFUNDS } from '../data/mockFinance';

export const useRefundsQuery = (
  page = 1,
  limit = 20,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ['refunds', { page, limit, status, search }],
    queryFn: async () => {
      try {
        const res = await financeApi.getRefunds(page, limit, status, search);
        if (res.data && res.data.length > 0) {
          return res;
        }
      } catch (e) {
        // Fallback to mock data in development/mock mode
      }

      // Filter mock refunds
      let filtered = [...MOCK_REFUNDS];
      if (status && status !== 'all') {
        filtered = filtered.filter(
          (r) => (r.status || '').toLowerCase() === status.toLowerCase()
        );
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(
          (r) =>
            (r.refund_code || '').toLowerCase().includes(q) ||
            (r.booking_code || '').toLowerCase().includes(q) ||
            (r.customer?.name || '').toLowerCase().includes(q) ||
            (r.customer?.full_name || '').toLowerCase().includes(q) ||
            (r.reason || '').toLowerCase().includes(q)
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

export const useRefundDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['refund-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      try {
        const res = await financeApi.getRefundById(id);
        if (res) return res;
      } catch (e) {
        // Fallback to mock item
      }
      const found = MOCK_REFUNDS.find((r) => r.id === id);
      if (found) return found;
      throw new Error('Refund not found');
    },
    enabled: Boolean(id),
  });
};
