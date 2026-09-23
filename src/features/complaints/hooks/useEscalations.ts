import { useQuery } from '@tanstack/react-query';
import { complaintsApi } from '../complaints.api';
import { MOCK_ESCALATION_CASES } from '../mock/complaints.mock';
import { filterAndPaginateMockCases } from '../utils/complaintsFormatters';

export const ESCALATIONS_QUERY_KEY = ['escalation-cases'];

export const useEscalationsQuery = (
  page = 1,
  pageSize = 20,
  status?: string,
  search?: string,
  priority?: string
) => {
  return useQuery({
    queryKey: [...ESCALATIONS_QUERY_KEY, { page, pageSize, status, search, priority }],
    queryFn: async () => {
      try {
        const res = await complaintsApi.getEscalations(page, pageSize, status, search, priority);
        if (res.data && res.data.length > 0) return res;
      } catch (e) {
        // Fallback to local mock data in offline / dev mode
      }
      return filterAndPaginateMockCases(MOCK_ESCALATION_CASES, page, pageSize, {
        status,
        search,
        priority,
      });
    },
    staleTime: 30000,
  });
};

export const useEscalationDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: [...ESCALATIONS_QUERY_KEY, 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No escalation ID provided');
      try {
        const res = await complaintsApi.getEscalationById(id);
        if (res) return res;
      } catch (e) {}
      const found = MOCK_ESCALATION_CASES.find((e) => e.id === id);
      if (found) return found;
      throw new Error('Escalation case not found');
    },
    enabled: Boolean(id),
  });
};
