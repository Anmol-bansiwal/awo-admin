import { apiFetch } from './apiUtils';
import type { Customer, CustomerListResponse, CustomerDetailResponse } from '../features/customers/customers.types';

/**
 * Service API methods for managing customer accounts on the platform.
 */
export const customerApi = {
  /**
   * Fetches a paginated list of registered customers.
   * 
   * @param page - Current page number (1-based, default: 1).
   * @param pageSize - Total customers per page (default: 20).
   * @returns Paginated customer list with metadata.
   */
  getCustomers: async (page = 1, pageSize = 20): Promise<CustomerListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    return apiFetch<CustomerListResponse>(`/api/v1/admin/customers?${params.toString()}`);
  },

  /**
   * Fetches full profile details for a specific customer.
   * 
   * @param id - Unique customer ID string.
   * @returns Detailed Customer entity.
   */
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await apiFetch<CustomerDetailResponse | Customer>(`/api/v1/admin/customers/${id}`);
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Customer;
  },

  /**
   * Suspends an active customer account.
   * 
   * @param id - Unique customer ID string.
   * @returns Updated Customer entity.
   */
  suspendCustomer: async (id: string): Promise<Customer> => {
    const response = await apiFetch<CustomerDetailResponse | Customer>(`/api/v1/admin/customers/${id}/suspend`, {
      method: 'POST',
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Customer;
  },

  /**
   * Reactivates a suspended customer account.
   * 
   * @param id - Unique customer ID string.
   * @returns Updated Customer entity.
   */
  reactivateCustomer: async (id: string): Promise<Customer> => {
    const response = await apiFetch<CustomerDetailResponse | Customer>(`/api/v1/admin/customers/${id}/reactivate`, {
      method: 'POST',
    });
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Customer;
  },
};

export const customerService = customerApi;
export const customersApi = customerApi;
