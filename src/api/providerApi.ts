import { apiFetch } from './apiUtils';
import type { Provider, ProviderListResponse, ProviderDetailResponse } from '../features/providers/providers.types';

/**
 * Service API methods for managing service providers and KYC verifications.
 */
export const providerApi = {
  /**
   * Fetches a paginated list of providers with optional status filtering.
   * 
   * @param page - Page number (default: 1)
   * @param pageSize - Items per page (default: 20)
   * @param status - Optional status filter ('pending', 'active', 'suspended', 'all')
   * @returns Paginated list response containing providers and metadata
   */
  getProviders: async (
    page = 1,
    pageSize = 20,
    status?: string
  ): Promise<ProviderListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') {
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
   * Rejects a provider's pending KYC submission.
   * 
   * @param id - Provider unique ID
   * @returns Updated Provider record
   */
  rejectKyc: async (id: string): Promise<Provider> => {
    const response = await apiFetch<ProviderDetailResponse | Provider>(`/api/v1/admin/providers/${id}/kyc/reject`, {
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
