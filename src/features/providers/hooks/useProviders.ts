import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerApi } from '../../../api/providerApi';
import type { KycRejectPayload } from '../providers.types';

/**
 * Root cache key for provider-related queries in TanStack Query.
 */
export const PROVIDERS_QUERY_KEY = ['providers'];

/**
 * Hook to fetch paginated provider accounts with optional search query and status filtering.
 * 
 * @param page - Current page index (1-based, default: 1).
 * @param pageSize - Number of items per page (default: 20, max: 100).
 * @param q - Search query string (searches name, email and phone).
 * @param status - Optional status filter ('active' | 'suspended').
 * @returns React Query result with provider list and pagination metadata.
 */
export const useProvidersQuery = (
  page = 1,
  pageSize = 20,
  q?: string,
  status?: string
) => {
  return useQuery({
    queryKey: [...PROVIDERS_QUERY_KEY, page, pageSize, q || '', status || 'all'],
    queryFn: () => providerApi.getProviders(page, pageSize, q, status),
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
 * Hook to fetch complete Didit KYC session and verification data for a specific provider.
 * 
 * @param id - Provider ID string.
 * @returns React Query result containing Didit KYC verification data.
 */
export const useProviderKycQuery = (id: string) => {
  return useQuery({
    queryKey: [...PROVIDERS_QUERY_KEY, 'kyc', id],
    queryFn: () => providerApi.getProviderKyc(id),
    enabled: Boolean(id),
  });
};

/**
 * Mutation hook to suspend an active provider account.
 * - Calls POST /api/v1/admin/providers/:id/suspend
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
 * Allowed when kyc_status is pending_admin_approval or in_review.
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
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'kyc', id] });
    },
  });
};

/**
 * Mutation hook to reject a provider's KYC submission with a reason code and optional note.
 * - Calls POST /api/v1/admin/providers/:id/kyc/reject
 * 
 * @returns Mutation object accepting `{ id: string; payload: KycRejectPayload }`.
 */
export const useRejectKycMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: KycRejectPayload }) =>
      providerApi.rejectKyc(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'details', id] });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'kyc', id] });
    },
  });
};

/**
 * Mutation hook to ask the provider to redo failed KYC steps (resubmit).
 * - Calls POST /api/v1/admin/providers/:id/kyc/resubmit
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useResubmitKycMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providerApi.resubmitKyc(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'details', id] });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'kyc', id] });
    },
  });
};

/**
 * Mutation hook to reset provider KYC attempts back to 3 and clear previous decision.
 * - Calls POST /api/v1/admin/providers/:id/kyc/reset-attempts
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useResetKycAttemptsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => providerApi.resetKycAttempts(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'details', id] });
      queryClient.invalidateQueries({ queryKey: [...PROVIDERS_QUERY_KEY, 'kyc', id] });
    },
  });
};
