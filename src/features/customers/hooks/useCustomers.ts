import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../../../api/customerApi';

/**
 * Root cache key for customer queries in TanStack Query.
 */
export const CUSTOMERS_QUERY_KEY = ['customers'];

/**
 * Hook to fetch paginated customer accounts.
 * 
 * @param page - Current page number (1-based, default: 1).
 * @param pageSize - Total customers per page (default: 20).
 * @returns React Query result with customers list and pagination metadata.
 */
export const useCustomersQuery = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, page, pageSize],
    queryFn: () => customerApi.getCustomers(page, pageSize),
  });
};

/**
 * Hook to fetch full profile details for a specific customer by ID.
 * 
 * @param id - Unique customer ID string.
 * @returns React Query result containing detailed customer record.
 */
export const useCustomerDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, 'details', id],
    queryFn: () => customerApi.getCustomerById(id),
    enabled: Boolean(id),
  });
};

/**
 * Mutation hook to suspend a customer's account.
 * - Calls POST /api/v1/admin/customers/:id/suspend
 * - Automatically invalidates customer list and details caches.
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useSuspendCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.suspendCustomer(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_QUERY_KEY, 'details', id] });
    },
  });
};

/**
 * Mutation hook to reactivate a suspended customer's account.
 * - Calls POST /api/v1/admin/customers/:id/reactivate
 * - Automatically invalidates customer list and details caches.
 * 
 * @returns Mutation object accepting `id: string`.
 */
export const useReactivateCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.reactivateCustomer(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_QUERY_KEY, 'details', id] });
    },
  });
};
