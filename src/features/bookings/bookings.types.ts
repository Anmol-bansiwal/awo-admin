export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'pending'
  | 'accepted'
  | 'assigned'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | string;

export interface BookingCustomer {
  id: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string | null;
}

export interface BookingProvider {
  id: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string | null;
  category?: string;
}

export interface BookingService {
  id?: string;
  name?: string;
  title?: string;
  category?: string;
  description?: string;
  price?: number;
}

export interface EscrowTransaction {
  id?: string;
  reference?: string;
  amount?: number;
  currency?: string;
  status?: string;
  payment_method?: string;
  payment_state?: string;
  created_at?: string;
  released_at?: string | null;
}

export interface ProviderActivity {
  id?: string;
  action: string;
  description?: string;
  timestamp: string;
  note?: string;
}

export interface BookingTimelineStep {
  step_key: string;
  title: string;
  description: string;
  timestamp: string | null;
  is_completed: boolean;
  is_current: boolean;
}

export interface ServiceProgressStep {
  label: string;
  key: string;
  timestamp?: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
  description?: string;
}

export interface Booking {
  id: string;
  booking_code?: string;
  reference_number?: string;
  status: BookingStatus;
  customer_id?: string;
  customer?: BookingCustomer | null;
  provider_id?: string | null;
  provider?: BookingProvider | null;
  service_id?: string;
  service?: BookingService | string | null;
  service_name?: string;
  category_name?: string;
  scheduled_at?: string | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  service_address?: string | null;
  address?: string | null;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  amount?: number;
  total_amount?: number;
  currency?: string;
  notes?: string | null;
  progress_state?: string | null;
  progress_history?: ProviderActivity[];
  provider_activities?: ProviderActivity[];
  timeline?: BookingTimelineStep[];
  escrow?: EscrowTransaction | null;
  escrow_status?: string | null;
  payment_status?: string | null;
  created_at: string;
  updated_at?: string;
  completed_at?: string | null;
  cancelled_at?: string | null;
}

export interface BookingPaginationMetadata {
  page: number;
  page_size: number;
  total: number;
}

export interface BookingListResponse {
  data: Booking[];
  metadata?: BookingPaginationMetadata;
}

export interface BookingDetailResponse {
  data: Booking;
}

export interface BookingFiltersState {
  search: string;
  status: string;
  service?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateBookingRequest {
  category_id: string;
  issues: string[];
  notes?: string;
  photo_keys?: string[];
  address: string;
  latitude?: number;
  longitude?: number;
  date: string;
  slot: 'morning' | 'afternoon' | 'evening';
}

export interface CreateBookingResponse {
  data: {
    id: string;
    status: string;
    payment_status: string;
    date: string;
    slot: string;
    address: string;
    latitude: number;
    longitude: number;
    category: {
      id: string;
      slug: string;
      name: string;
    };
    tasks: {
      id: string;
      sort_order: number;
      issue: string;
    }[];
    created_at: string;
  };
}
