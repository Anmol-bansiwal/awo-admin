import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintsApi } from '../complaints.api';
import { MOCK_REFUND_REQUESTS, mockApproveRefund, mockRejectRefund } from '../mock/complaints.mock';
import { filterAndPaginateMockCases } from '../utils/complaintsFormatters';

export const REFUND_REQUESTS_QUERY_KEY = ['complaint-refund-requests'];

export const useRefundRequestsQuery = (
  page = 1,
  pageSize = 20,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: [...REFUND_REQUESTS_QUERY_KEY, { page, pageSize, status, search }],
    queryFn: async () => {
      try {
        const res = await complaintsApi.getRefundRequests(page, pageSize, status, search);
        if (res.data && res.data.length > 0) return res;
      } catch (e) {
        // Fallback to local mock data in offline / dev mode
      }
      return filterAndPaginateMockCases(MOCK_REFUND_REQUESTS, page, pageSize, {
        status,
        search,
      });
    },
    staleTime: 30000,
  });
};

export const useRefundRequestDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: [...REFUND_REQUESTS_QUERY_KEY, 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('No refund request ID provided');
      try {
        const res = await complaintsApi.getRefundRequestById(id);
        if (res) return res;
      } catch (e) {}
      const found = MOCK_REFUND_REQUESTS.find((r) => r.id === id);
      if (found) return found;
      throw new Error('Refund request case not found');
    },
    enabled: Boolean(id),
  });
};

export const useApproveRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      try {
        const res = await complaintsApi.approveRefundRequest(id, notes);
        if (res) return res;
      } catch (e) {}
      return mockApproveRefund(id, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFUND_REQUESTS_QUERY_KEY });
    },
  });
};

export const useRejectRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      try {
        const res = await complaintsApi.rejectRefundRequest(id, reason);
        if (res) return res;
      } catch (e) {}
      return mockRejectRefund(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFUND_REQUESTS_QUERY_KEY });
    },
  });
};
