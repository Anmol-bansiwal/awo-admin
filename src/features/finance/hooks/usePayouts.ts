import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../finance.api';
import { MOCK_PAYOUTS } from '../data/mockFinance';

export const usePayoutsQuery = (
  page = 1,
  limit = 20,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ['payouts', { page, limit, status, search }],
    queryFn: async () => {
      try {
        const res = await financeApi.getPayouts(page, limit, status, search);
        if (res.data && res.data.length > 0) {
          return res;
        }
      } catch (e) {
        // Fallback to mock data in development/mock mode
      }

      // Filter mock payouts
      let filtered = [...MOCK_PAYOUTS];
      if (status && status !== 'all') {
        filtered = filtered.filter(
          (p) => (p.status || '').toLowerCase() === status.toLowerCase()
        );
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            (p.payout_code || '').toLowerCase().includes(q) ||
            (p.booking_code || '').toLowerCase().includes(q) ||
            (p.provider?.name || '').toLowerCase().includes(q) ||
            (p.provider?.full_name || '').toLowerCase().includes(q)
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

export const usePayoutDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['payout-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      try {
        const res = await financeApi.getPayoutById(id);
        if (res) return res;
      } catch (e) {
        // Fallback to mock item
      }
      const found = MOCK_PAYOUTS.find((p) => p.id === id);
      if (found) return found;
      throw new Error('Payout not found');
    },
    enabled: Boolean(id),
  });
};
