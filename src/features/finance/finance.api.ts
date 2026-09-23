import { apiFetch } from '../../api/apiUtils';
import type {
  Transaction,
  TransactionListResponse,
  EscrowRecord,
  EscrowListResponse,
  EscrowSummary,
  Payout,
  PayoutListResponse,
  Refund,
  RefundListResponse,
  CommissionConfig,
  CommissionUpdateRequest,
  RevenueReport,
} from './finance.types';

/**
 * Service API methods for financial management, transactions, escrow, payouts, refunds, commission, and revenue.
 */
export const financeApi = {
  // --- TRANSACTIONS ---
  /**
   * Fetches a paginated list of financial transactions.
   * 
   * @param page - Page number (1-based, default: 1)
   * @param pageSize - Items per page (default: 20)
   * @param status - Filter by status ('completed', 'escrow_hold', 'refunded', 'failed', 'all')
   * @param search - Search term for codes, names, reference numbers
   * @param type - Filter by transaction type ('customer_payment', 'provider_payout', 'refund', 'all')
   * @returns Paginated TransactionListResponse
   */
  getTransactions: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string,
    type?: string
  ): Promise<TransactionListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());
    if (type && type !== 'all') params.append('type', type);

    const response = await apiFetch<TransactionListResponse | Transaction[]>(
      `/api/v1/admin/finance/transactions?${params.toString()}`
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

  /**
   * Fetches full audit details for a specific transaction by ID.
   * 
   * @param id - Transaction unique ID
   * @returns Detailed Transaction record
   */
  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await apiFetch<{ data?: Transaction } | Transaction>(
      `/api/v1/admin/finance/transactions/${id}`
    );
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Transaction;
  },

  // --- ESCROW ---
  /**
   * Fetches paginated escrow records currently held or released by the platform.
   * 
   * @param page - Page number
   * @param pageSize - Items per page
   * @param status - Escrow status filter ('held', 'released', 'refunded', 'all')
   * @param search - Search term
   * @returns Paginated EscrowListResponse
   */
  getEscrowRecords: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string
  ): Promise<EscrowListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const response = await apiFetch<EscrowListResponse | EscrowRecord[]>(
      `/api/v1/admin/finance/escrow?${params.toString()}`
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

  /**
   * Fetches high-level escrow summary totals (total held, pending release, disputed).
   * 
   * @returns EscrowSummary totals
   */
  getEscrowSummary: async (): Promise<EscrowSummary> => {
    const response = await apiFetch<{ data?: EscrowSummary } | EscrowSummary>(
      '/api/v1/admin/finance/escrow/summary'
    );
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as EscrowSummary;
  },

  // --- PAYOUTS ---
  /**
   * Fetches paginated provider disbursements and payout records.
   * 
   * @param page - Page number
   * @param pageSize - Items per page
   * @param status - Payout status filter ('processed', 'pending', 'failed', 'all')
   * @param search - Search term
   * @returns Paginated PayoutListResponse
   */
  getPayouts: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string
  ): Promise<PayoutListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const response = await apiFetch<PayoutListResponse | Payout[]>(
      `/api/v1/admin/finance/payouts?${params.toString()}`
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

  /**
   * Fetches detailed data for a specific payout by ID.
   * 
   * @param id - Payout unique ID
   * @returns Detailed Payout entity
   */
  getPayoutById: async (id: string): Promise<Payout> => {
    const response = await apiFetch<{ data?: Payout } | Payout>(
      `/api/v1/admin/finance/payouts/${id}`
    );
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Payout;
  },

  // --- REFUNDS ---
  /**
   * Fetches paginated customer refund requests and processing records.
   * 
   * @param page - Page number
   * @param pageSize - Items per page
   * @param status - Refund status filter ('completed', 'processing', 'rejected', 'all')
   * @param search - Search term
   * @returns Paginated RefundListResponse
   */
  getRefunds: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string
  ): Promise<RefundListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const response = await apiFetch<RefundListResponse | Refund[]>(
      `/api/v1/admin/finance/refunds?${params.toString()}`
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

  /**
   * Fetches full details for a single refund by ID.
   * 
   * @param id - Refund unique ID
   * @returns Detailed Refund entity
   */
  getRefundById: async (id: string): Promise<Refund> => {
    const response = await apiFetch<{ data?: Refund } | Refund>(
      `/api/v1/admin/finance/refunds/${id}`
    );
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as Refund;
  },

  // --- COMMISSION CONFIGURATION ---
  /**
   * Fetches platform commission settings and tiered fee rules.
   * 
   * @returns Current CommissionConfig settings
   */
  getCommissionConfig: async (): Promise<CommissionConfig> => {
    const response = await apiFetch<{ data?: CommissionConfig } | CommissionConfig>(
      '/api/v1/admin/finance/commission'
    );
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as CommissionConfig;
  },

  /**
   * Updates platform commission rates and payment gateway fee settings.
   * 
   * @param payload - Updated commission configuration properties
   * @returns Updated CommissionConfig settings
   */
  updateCommissionConfig: async (
    payload: CommissionUpdateRequest
  ): Promise<CommissionConfig> => {
    const response = await apiFetch<{ data?: CommissionConfig } | CommissionConfig>(
      '/api/v1/admin/finance/commission',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as CommissionConfig;
  },

  // --- REVENUE REPORTS ---
  /**
   * Fetches aggregated revenue analytics, gross booking values, and commission earnings over time.
   * 
   * @param period - Reporting time period ('daily', 'weekly', 'monthly', 'yearly')
   * @param startDate - Optional ISO start date string
   * @param endDate - Optional ISO end date string
   * @returns Aggregated RevenueReport object
   */
  getRevenueReports: async (
    period = 'monthly',
    startDate?: string,
    endDate?: string
  ): Promise<RevenueReport> => {
    const params = new URLSearchParams({ period });
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await apiFetch<{ data?: RevenueReport } | RevenueReport>(
      `/api/v1/admin/finance/revenue-reports?${params.toString()}`
    );

    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }
    return response as RevenueReport;
  },
};
