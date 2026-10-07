import { apiFetch } from './apiUtils';
import type {
  Provider,
  ProviderListResponse,
  ProviderDetailResponse,
  ProviderKycData,
  ProviderKycDetailResponse,
  KycRejectPayload,
} from '../features/providers/providers.types';

/**
 * Service API methods for managing service providers and KYC verifications.
 */
export const providerApi = {
  /**
   * Fetches a paginated list of providers with optional search and status filtering.
   * 
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 20, max: 100)
   * @param q - Search query across name, email and phone
   * @param status - Optional status filter ('active' | 'suspended')
   * @returns Paginated list response containing providers and metadata
   */
  getProviders: async (
    page = 1,
    pageSize = 20,
    q?: string,
    status?: string
  ): Promise<ProviderListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(Math.min(pageSize, 100)),
    });

    if (q && q.trim()) {
      params.append('q', q.trim());
    }

    // Backend rule: status must be active or suspended. Any other value gives 400.
    if (status && (status === 'active' || status === 'suspended')) {
      params.append('status', status);
    }

    return apiFetch<ProviderListResponse>(`/api/v1/admin/providers?${params.toString()}`);
  },

  /**
   * Fetches detailed profile information for a specific provider.
   * 
   * @param id - Provider unique ID
   * @returns Detailed Provider record
   */
  getProviderById: async (id: string): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}`);
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Provider;
  },

  /**
   * Fetches detailed Didit KYC session and verification data for a provider.
   * 
   * @param id - Provider unique ID
   * @returns Provider KYC data object
   */
  getProviderKyc: async (id: string): Promise<ProviderKycData> => {
    const response = await apiFetch<ProviderKycDetailResponse>(`/api/v1/admin/providers/${id}/kyc`);
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as unknown as ProviderKycData;
  },

  /**
   * Suspends an active provider's account.
   * 
   * @param id - Provider unique ID
   * @returns Updated Provider record
   */
  suspendProvider: async (id: string): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}/suspend`, {
      method: 'POST',
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Provider;
  },

  /**
   * Reactivates a suspended provider's account.
   * 
   * @param id - Provider unique ID
   * @returns Updated Provider record
   */
  reactivateProvider: async (id: string): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}/reactivate`, {
      method: 'POST',
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Provider;
  },

  /**
   * Approves a provider's pending KYC verification.
   * Allowed when kyc_status is pending_admin_approval or in_review.
   * 
   * @param id - Provider unique ID
   * @returns Updated Provider record
   */
  approveKyc: async (id: string): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}/kyc/approve`, {
      method: 'POST',
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Provider;
  },

  /**
   * Rejects a provider's pending KYC submission with a mandatory reason code and optional admin note.
   * 
   * @param id - Provider unique ID
   * @param payload - Reason code and optional note
   * @returns Updated Provider record
   */
  rejectKyc: async (id: string, payload: KycRejectPayload): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}/kyc/reject`, {
      method: 'POST',
      body: JSON.stringify({
        reason_code: payload.reason_code,
        ...(payload.note?.trim() ? { note: payload.note.trim() } : {}),
      }),
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Provider;
  },

  /**
   * Asks the provider to redo failed KYC steps (resubmit).
   * Used when latest_session is In Review or Declined.
   * 
   * @param id - Provider unique ID
   * @returns Updated Provider record
   */
  resubmitKyc: async (id: string): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}/kyc/resubmit`, {
      method: 'POST',
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Provider;
  },

  /**
   * Resets attempts back to 3 and sets status back to pending.
   * Clears previous decision and reason.
   * 
   * @param id - Provider unique ID
   * @returns Updated Provider record
   */
  resetKycAttempts: async (id: string): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}/kyc/reset-attempts`, {
      method: 'POST',
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Provider;
  },
};

export const providerService = providerApi;
export const providersApi = providerApi;
