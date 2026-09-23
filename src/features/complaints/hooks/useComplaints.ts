import { useQuery } from '@tanstack/react-query';
import { complaintsApi } from '../complaints.api';
import { MOCK_CUSTOMER_COMPLAINTS } from '../mock/complaints.mock';
import { filterAndPaginateMockCases } from '../utils/complaintsFormatters';

export const COMPLAINTS_QUERY_KEY = ['customer-complaints'];

export const useComplaintsQuery = (
  page = 1,
  pageSize = 20,
  status?: string,
  search?: string,
  priority?: string
) => {
  return useQuery({
    queryKey: [...COMPLAINTS_QUERY_KEY, { page, pageSize, status, search, priority }],
    queryFn: async () => {
      try {
        const res = await complaintsApi.getComplaints(page, pageSize, status, search, priority);
        if (res.data && res.data.length > 0) return res;
      } catch (e) {
        // Fallback to local mock data in offline / dev mode
      }
      return filterAndPaginateMockCases(MOCK_CUSTOMER_COMPLAINTS, page, pageSize, {
        status,
        search,
        priority,
      });
    },
    staleTime: 30000,
  });
};

export const useComplaintDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: [...COMPLAINTS_QUERY_KEY, 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No complaint ID provided');
      try {
        const res = await complaintsApi.getComplaintById(id);
        if (res) return res;
      } catch (e) {}
      const found = MOCK_CUSTOMER_COMPLAINTS.find((c) => c.id === id);
      if (found) return found;
      throw new Error('Complaint case not found');
    },
    enabled: Boolean(id),
  });
};
