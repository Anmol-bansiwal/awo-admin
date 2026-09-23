import { apiFetch } from '../../api/apiUtils';
import type {
  ComplaintCase,
  ComplaintListResponse,
  CustomerComplaint,
  DisputeListResponse,
  ProviderDispute,
  RefundRequestCase,
  RefundRequestListResponse,
  EscalationCase,
  EscalationListResponse,
} from './complaints.types';

export const complaintsApi = {
  getComplaints: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string,
    priority?: string
  ): Promise<ComplaintListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());
    if (priority && priority !== 'all') params.append('priority', priority);

    const response = await apiFetch<ComplaintListResponse | CustomerComplaint[]>(
      `/api/v1/admin/complaints?${params.toString()}`
    );

    if (Array.isArray(response)) {
      return {
        data: response,
        metadata: {
          page,
          page_size: pageSize,
          total: response.length,
        },
      };
    }
    return response;
  },

  getComplaintById: async (id: string): Promise<CustomerComplaint> => {
    return apiFetch<CustomerComplaint>(`/api/v1/admin/complaints/${id}`);
  },

  getDisputes: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string
  ): Promise<DisputeListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const response = await apiFetch<DisputeListResponse | ProviderDispute[]>(
      `/api/v1/admin/disputes?${params.toString()}`
    );

    if (Array.isArray(response)) {
      return {
        data: response,
        metadata: {
          page,
          page_size: pageSize,
          total: response.length,
        },
      };
    }
    return response;
  },

  getDisputeById: async (id: string): Promise<ProviderDispute> => {
    return apiFetch<ProviderDispute>(`/api/v1/admin/disputes/${id}`);
  },

  getRefundRequests: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string
  ): Promise<RefundRequestListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const response = await apiFetch<RefundRequestListResponse | RefundRequestCase[]>(
      `/api/v1/admin/refund-requests?${params.toString()}`
    );

    if (Array.isArray(response)) {
      return {
        data: response,
        metadata: {
          page,
          page_size: pageSize,
          total: response.length,
        },
      };
    }
    return response;
  },

  getRefundRequestById: async (id: string): Promise<RefundRequestCase> => {
    return apiFetch<RefundRequestCase>(`/api/v1/admin/refund-requests/${id}`);
  },

  getEscalations: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string,
    priority?: string
  ): Promise<EscalationListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());
    if (priority && priority !== 'all') params.append('priority', priority);

    const response = await apiFetch<EscalationListResponse | EscalationCase[]>(
      `/api/v1/admin/escalations?${params.toString()}`
    );

    if (Array.isArray(response)) {
      return {
        data: response,
        metadata: {
          page,
          page_size: pageSize,
          total: response.length,
        },
      };
    }
    return response;
  },

  getEscalationById: async (id: string): Promise<EscalationCase> => {
    return apiFetch<EscalationCase>(`/api/v1/admin/escalations/${id}`);
  },

  approveRefundRequest: async (id: string, notes?: string): Promise<RefundRequestCase> => {
    return apiFetch<RefundRequestCase>(`/api/v1/admin/refund-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  rejectRefundRequest: async (id: string, reason?: string): Promise<RefundRequestCase> => {
    return apiFetch<RefundRequestCase>(`/api/v1/admin/refund-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  getCaseById: async (id: string): Promise<ComplaintCase> => {
    return apiFetch<ComplaintCase>(`/api/v1/admin/cases/${id}`);
  },
};
