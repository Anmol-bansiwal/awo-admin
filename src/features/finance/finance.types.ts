/**
 * Phase 8: Financial Management TypeScript Definitions
 */

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'held_in_escrow' | string;

export type TransactionType = 'booking_payment' | 'payout' | 'refund' | 'commission' | string;

export interface TransactionCustomer {
  id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

export interface TransactionProvider {
  id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

export interface Transaction {
  id: string;
  transaction_code?: string;
  reference_number?: string;
  booking_id?: string;
  booking_code?: string;
  customer?: TransactionCustomer;
  customer_id?: string;
  provider?: TransactionProvider;
  provider_id?: string;
  amount: number;
  currency?: string;
  type: TransactionType;
  status: TransactionStatus;
  payment_method?: string;
  created_at: string;
  updated_at?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface TransactionListResponse {
  data: Transaction[];
  metadata?: {
    page: number;
    page_size: number;
    total: number;
  };
}

export type EscrowStatus = 'held' | 'pending_release' | 'released' | 'refunded' | 'disputed' | string;

export interface EscrowRecord {
  id: string;
  reference?: string;
  booking_id?: string;
  booking_code?: string;
  customer?: TransactionCustomer;
  customer_id?: string;
  provider?: TransactionProvider;
  provider_id?: string;
  amount: number;
  currency?: string;
  status: EscrowStatus;
  hold_date?: string;
  release_date?: string;
  service_completed_at?: string;
  created_at: string;
  notes?: string;
}

export interface EscrowSummary {
  total_escrow?: number;
  pending_release?: number;
  released?: number;
  refunded?: number;
  currency?: string;
}

export interface EscrowListResponse {
  data: EscrowRecord[];
  summary?: EscrowSummary;
  metadata?: {
    page: number;
    page_size: number;
    total: number;
  };
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | string;

export interface Payout {
  id: string;
  payout_code?: string;
  provider?: TransactionProvider;
  provider_id?: string;
  amount: number;
  currency?: string;
  booking_id?: string;
  booking_code?: string;
  status: PayoutStatus;
  payout_method?: string;
  bank_account_info?: string;
  requested_at?: string;
  processed_at?: string;
  created_at: string;
  failure_reason?: string;
}

export interface PayoutListResponse {
  data: Payout[];
  metadata?: {
    page: number;
    page_size: number;
    total: number;
  };
}

export type RefundStatus = 'requested' | 'under_review' | 'approved' | 'rejected' | 'processing' | 'completed' | string;

export interface Refund {
  id: string;
  refund_code?: string;
  booking_id?: string;
  booking_code?: string;
  customer?: TransactionCustomer;
  customer_id?: string;
  amount: number;
  currency?: string;
  reason?: string;
  status: RefundStatus;
  requested_at?: string;
  reviewed_at?: string;
  processed_at?: string;
  created_at: string;
  admin_notes?: string;
}

export interface RefundListResponse {
  data: Refund[];
  metadata?: {
    page: number;
    page_size: number;
    total: number;
  };
}

export interface CategoryCommission {
  category_id: string;
  category_name: string;
  commission_percentage: number;
  is_custom: boolean;
}

export interface CommissionConfig {
  default_commission_percentage: number;
  category_commissions?: CategoryCommission[];
  updated_at?: string;
  updated_by?: string;
}

export interface CommissionUpdateRequest {
  default_commission_percentage?: number;
  category_commissions?: {
    category_id: string;
    commission_percentage: number;
  }[];
}

export interface RevenuePeriodData {
  period: string;
  gross_booking_value: number;
  platform_commission: number;
  provider_payouts: number;
  refunds: number;
  net_revenue: number;
  currency?: string;
}

export interface RevenueReport {
  summary?: {
    total_revenue: number;
    total_commission: number;
    total_payouts: number;
    total_refunds: number;
    currency?: string;
  };
  periods: RevenuePeriodData[];
}
