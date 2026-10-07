import type { UserListItem } from '../../components/UserTable.types';

export type ProviderStatus = 'active' | 'suspended' | 'pending' | 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export type KycStatus =
  | 'pending'
  | 'in_progress'
  | 'in_review'
  | 'pending_admin_approval'
  | 'approved'
  | 'declined'
  | 'rejected'
  | string;

export type KycRejectionReasonCode =
  | 'id_unclear'
  | 'selfie_mismatch'
  | 'name_mismatch'
  | 'document_not_accepted'
  | 'unable_to_verify'
  | 'other';

export interface KycRejectPayload {
  reason_code: KycRejectionReasonCode;
  note?: string;
}

export interface KycRejectionReasonOption {
  code: KycRejectionReasonCode;
  label: string;
  userMessage: string;
}

export const KYC_REJECTION_REASONS: KycRejectionReasonOption[] = [
  {
    code: 'id_unclear',
    label: 'ID photo unclear',
    userMessage: "Your ID photo wasn't clear enough.",
  },
  {
    code: 'selfie_mismatch',
    label: 'Selfie doesn’t match ID',
    userMessage: "Your selfie didn't match your ID photo.",
  },
  {
    code: 'name_mismatch',
    label: 'Name doesn’t match profile',
    userMessage: 'The name on your ID doesn’t match your AWO profile.',
  },
  {
    code: 'document_not_accepted',
    label: 'Document not accepted',
    userMessage: 'This document isn’t accepted.',
  },
  {
    code: 'unable_to_verify',
    label: 'Unable to verify / suspected fraud',
    userMessage: 'We couldn’t verify your identity.',
  },
  {
    code: 'other',
    label: 'Other (write a note)',
    userMessage: 'Your verification wasn’t accepted. Contact support for details.',
  },
];

export interface KycWarning {
  feature?: string;
  risk?: string;
  severity: 'error' | 'warning' | 'information' | string;
  short_description: string;
  long_description: string;
}

export interface KycScores {
  face_match?: number | null;
  liveness?: number | null;
}

export interface KycIdDocument {
  full_name?: string | null;
  date_of_birth?: string | null;
  document_type?: string | null;
  document_number?: string | null;
  nationality?: string | null;
  issuing_country?: string | null;
  expiration_date?: string | null;
  name_matches_profile?: boolean | null;
}

export interface KycIpInfo {
  country?: string | null;
  is_vpn_or_tor?: boolean;
  is_data_center?: boolean;
  platform?: string | null;
}

export interface KycImages {
  id_front?: string | null;
  id_back?: string | null;
  id_portrait?: string | null;
  selfie?: string | null;
}

export interface KycSessionSummary {
  session_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  warnings?: KycWarning[];
  scores?: KycScores;
  id_document?: KycIdDocument | null;
  ip?: KycIpInfo | null;
  images?: KycImages | null;
  images_available?: boolean;
}

export interface KycDecision {
  action: 'approved' | 'rejected' | string;
  by?: {
    id: string;
    name: string;
  } | null;
  at?: string | null;
  rejection?: {
    code: string;
    message: string;
    note?: string;
  } | null;
}

export interface ProviderKycData {
  kyc_status: KycStatus;
  attempts_used: number;
  max_attempts: number;
  decision: KycDecision | null;
  latest_session: KycSessionSummary | null;
  history?: {
    session_id: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
}

export interface ProviderKycDetailResponse {
  data: ProviderKycData;
}

export interface IdentityType {
  id: string;
  slug: string;
  name: string;
}

export interface ProviderProfile {
  identity_type?: IdentityType | null;
  identity_front_url?: string | null;
  identity_back_url?: string | null;
  address_proof_url?: string | null;
  category_ids?: string[];
  skills?: string[];
  bio?: string | null;
  years_experience?: string | null;
  hourly_rate?: number | string | null;
  regular_clients?: string | null;
  certification_status?: string | null;
  accepting_requests?: boolean;
  kyc_status?: KycStatus | null;
  kyc_attempts?: number;
}

export interface ServiceArea {
  id: string;
  kind?: string;
  type?: string;
  label?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface Provider extends UserListItem {
  kyc_status?: KycStatus | null;
  provider?: ProviderProfile | null;
  service_areas?: ServiceArea[];
  kyc_session?: {
    session_id: string;
    status: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export interface ProviderPaginationMetadata {
  page: number;
  page_size: number;
  total: number;
}

export interface ProviderListResponse {
  data: Provider[];
  metadata: ProviderPaginationMetadata;
}

export interface ProviderDetailResponse {
  data: Provider;
}
