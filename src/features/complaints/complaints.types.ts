export type ComplaintType =
  | 'CUSTOMER_COMPLAINT'
  | 'PROVIDER_DISPUTE'
  | 'REFUND_REQUEST'
  | 'ESCALATION';

export type CaseStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'REJECTED'
  | 'ESCALATED';

export type CasePriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface CaseParticipant {
  id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  role?: 'customer' | 'provider' | 'admin';
}

export interface ComplaintCase {
  id: string;
  case_number: string;
  type: ComplaintType;
  category?: string;
  subject: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  
  customer?: CaseParticipant;
  customer_id?: string;
  provider?: CaseParticipant;
  provider_id?: string;

  booking_id?: string;
  booking_code?: string;
  service_title?: string;
  disputed_amount?: number;
  requested_refund_amount?: number;
  currency?: string;

  escalation_reason?: string;
  escalated_by?: string;
  escalated_at?: string;

  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;

  created_at: string;
  updated_at?: string;
}

export interface CustomerComplaint extends ComplaintCase {
  type: 'CUSTOMER_COMPLAINT';
}

export interface ProviderDispute extends ComplaintCase {
  type: 'PROVIDER_DISPUTE';
}

export interface RefundRequestCase extends ComplaintCase {
  type: 'REFUND_REQUEST';
  refund_reason?: string;
}

export interface EscalationCase extends ComplaintCase {
  type: 'ESCALATION';
  source_type?: 'CUSTOMER_COMPLAINT' | 'PROVIDER_DISPUTE' | 'REFUND_REQUEST';
}

export interface PaginatedMetadata {
  page: number;
  page_size: number;
  total: number;
}

export interface ComplaintListResponse {
  data: ComplaintCase[];
  metadata?: PaginatedMetadata;
}

export interface DisputeListResponse {
  data: ProviderDispute[];
  metadata?: PaginatedMetadata;
}

export interface RefundRequestListResponse {
  data: RefundRequestCase[];
  metadata?: PaginatedMetadata;
}

export interface EscalationListResponse {
  data: EscalationCase[];
  metadata?: PaginatedMetadata;
}
