import { apiFetch } from './apiUtils';
import type {
  Booking,
  BookingListResponse,
  BookingDetailResponse,
  CreateBookingRequest,
  CreateBookingResponse,
} from '../features/bookings/bookings.types';

/**
 * Service API methods for querying and managing customer service bookings.
 */
export const bookingApi = {
  /**
   * Fetches a paginated list of bookings with optional status and search filtering.
   * 
   * @param page - Current page number (1-based, default: 1).
   * @param pageSize - Total items per page (default: 20).
   * @param status - Optional booking status filter ('confirmed', 'completed', 'cancelled', 'all').
   * @param search - Optional customer/provider search keyword.
   * @returns Paginated BookingListResponse.
   */
  getBookings: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string,
    service?: string,
    startDate?: string,
    endDate?: string
  ): Promise<BookingListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    if (service && service.trim()) {
      params.append('service', service.trim());
    }
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }

    const response = await apiFetch<BookingListResponse | Booking[]>(
      `/api/v1/admin/bookings?${params.toString()}`
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
   * Fetches full details for a single booking by its unique ID.
   * 
   * @param id - Booking unique ID string.
   * @returns Detailed Booking entity.
   */
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await apiFetch<BookingDetailResponse | Booking>(
      `/api/v1/admin/bookings/${id}`
    );

    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }

    return response as Booking;
  },

  /**
   * Creates a new booking (Customer App / PWA Integration).
   * 
   * @param data - Create booking request payload.
   * @returns Create booking response payload.
   */
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    return apiFetch<CreateBookingResponse>('/api/v1/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const bookingService = bookingApi;
export const bookingsApi = bookingApi;
