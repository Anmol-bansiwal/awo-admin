export type CustomerStatus = 'active' | 'suspended' | 'ACTIVE' | 'SUSPENDED';

export interface ServiceLocation {
  id: string;
  kind?: string;
  type?: string;
  label?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface Customer {
  id: string;
  phone: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  provider?: string | null;
  role: string;
  service_locations?: ServiceLocation[];
  status: CustomerStatus;
  created_at: string;
}

export interface CustomerPaginationMetadata {
  page: number;
  page_size: number;
  total: number;
}

export interface CustomerListResponse {
  data: Customer[];
  metadata: CustomerPaginationMetadata;
}

export interface CustomerDetailResponse {
  data: Customer;
}
