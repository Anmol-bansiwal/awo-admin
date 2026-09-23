import { useQuery } from '@tanstack/react-query';
import { complaintsApi } from '../complaints.api';
import { MOCK_PROVIDER_DISPUTES } from '../mock/complaints.mock';
import { filterAndPaginateMockCases } from '../utils/complaintsFormatters';

export const DISPUTES_QUERY_KEY = ['provider-disputes'];

export const useDisputesQuery = (
  page = 1,
  pageSize = 20,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: [...DISPUTES_QUERY_KEY, { page, pageSize, status, search }],
    queryFn: async () => {
      try {
        const res = await complaintsApi.getDisputes(page, pageSize, status, search);
        if (res.data && res.data.length > 0) return res;
      } catch (e) {
        // Fallback to local mock data in offline / dev mode
      }
      return filterAndPaginateMockCases(MOCK_PROVIDER_DISPUTES, page, pageSize, {
        status,
        search,
      });
    },
    staleTime: 30000,
  });
};

export const useDisputeDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: [...DISPUTES_QUERY_KEY, 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No dispute ID provided');
      try {
        const res = await complaintsApi.getDisputeById(id);
        if (res) return res;
      } catch (e) {}
      const found = MOCK_PROVIDER_DISPUTES.find((d) => d.id === id);
      if (found) return found;
      throw new Error('Dispute case not found');
    },
    enabled: Boolean(id),
  });
};
