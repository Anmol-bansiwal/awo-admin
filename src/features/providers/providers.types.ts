import type { UserListItem } from '../../components/UserTable.types';

export type ProviderStatus = 'active' | 'suspended' | 'pending' | 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export type KycStatus =
  | 'approved'
  | 'rejected'
  | 'pending'
  | 'APPROVED'
  | 'REJECTED'
  | 'PENDING'
  | string;

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
  regular_clients?: string | null;
  certification_status?: string | null;
  accepting_requests?: boolean;
  kyc_status?: KycStatus | null;
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
  provider?: ProviderProfile | null;
  service_areas?: ServiceArea[];
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
