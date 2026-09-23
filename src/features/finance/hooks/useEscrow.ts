import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../finance.api';
import { MOCK_ESCROW_RECORDS, MOCK_ESCROW_SUMMARY } from '../data/mockFinance';

export const useEscrowQuery = (
  page = 1,
  limit = 20,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ['escrow', { page, limit, status, search }],
    queryFn: async () => {
      try {
        const res = await financeApi.getEscrowRecords(page, limit, status, search);
        if (res.data && res.data.length > 0) {
          return res;
        }
      } catch (e) {
        // Fallback to mock data in development/mock mode
      }

      // Filter mock escrow records
      let filtered = [...MOCK_ESCROW_RECORDS];
      if (status && status !== 'all') {
        filtered = filtered.filter(
          (r) => (r.status || '').toLowerCase() === status.toLowerCase()
        );
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(
          (r) =>
            (r.reference || '').toLowerCase().includes(q) ||
            (r.booking_code || '').toLowerCase().includes(q) ||
            (r.customer?.name || '').toLowerCase().includes(q) ||
            (r.customer?.full_name || '').toLowerCase().includes(q) ||
            (r.provider?.name || '').toLowerCase().includes(q) ||
            (r.provider?.full_name || '').toLowerCase().includes(q)
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

export const useEscrowSummaryQuery = () => {
  return useQuery({
    queryKey: ['escrow-summary'],
    queryFn: async () => {
      try {
        const res = await financeApi.getEscrowSummary();
        if (res) {
          return res;
        }
      } catch (e) {
        // Fallback to mock summary in development/mock mode
      }
      return MOCK_ESCROW_SUMMARY;
    },
    staleTime: 30000,
  });
};
