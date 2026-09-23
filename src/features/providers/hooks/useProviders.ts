import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerApi } from '../../../api/providerApi';

/**
 * Root cache key for provider-related queries in TanStack Query.
 */
export const PROVIDERS_QUERY_KEY = ['providers'];

/**
 * Hook to fetch paginated provider accounts with optional status filtering.
 * 
 * @param page - Current page index (1-based, default: 1).
 * @param pageSize - Number of items per page (default: 20).
 * @param status - Optional status filter ('all', 'active', 'suspended', 'pending').
 * @returns React Query result with provider list and pagination metadata.
 */
export const useProvidersQuery = (page = 1, pageSize = 20, status?: string) => {
  return useQuery({
    queryKey: [...PROVIDERS_QUERY_KEY, page, pageSize, status || 'all'],
    queryFn: () => providerApi.getProviders(page, pageSize, status),
  });
};

/**
 * Hook to fetch complete profile details for a specific provider by their unique ID.
 * 
 * @param id - Provider ID string.
 * @returns React Query result containing provider detail data.
 */
export const useProviderDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: [...PROVIDERS_QUERY_KEY, 'details', id],
    queryFn: () => providerApi.getProviderById(id),
    enabled: Boolean(id),
  });
};

/**
 * Mutation hook to suspend an active provider account.
 * - Calls POST /api/v1/admin/providers/:id/suspend
 * - Automatically invalidates provider list and detail caches on success.
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useSuspendProviderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providerApi.suspendProvider(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'details', id] });
    },
  });
};

/**
 * Mutation hook to reactivate a suspended provider account.
 * - Calls POST /api/v1/admin/providers/:id/reactivate
 * - Automatically invalidates provider list and detail caches on success.
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useReactivateProviderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providerApi.reactivateProvider(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'details', id] });
    },
  });
};

/**
 * Mutation hook to approve a provider's KYC documents and verification status.
 * - Calls POST /api/v1/admin/providers/:id/kyc/approve
 * - Automatically invalidates provider list and detail caches on success.
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useApproveKycMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providerApi.approveKyc(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'details', id] });
    },
  });
};

/**
 * Mutation hook to reject a provider's KYC submission.
 * - Calls POST /api/v1/admin/providers/:id/kyc/reject
 * - Automatically invalidates provider list and detail caches on success.
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useRejectKycMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providerApi.rejectKyc(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'details', id] });
    },
  });
};
