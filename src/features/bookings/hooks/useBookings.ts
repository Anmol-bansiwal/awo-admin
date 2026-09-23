import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../../../api/bookingApi';

/**
 * Root cache key for all booking queries in TanStack Query.
 */
export const BOOKINGS_QUERY_KEY = ['bookings'];

/**
 * Hook to fetch paginated customer service bookings with optional status and search filtering.
 * 
 * @param page - Current page number (1-based, default: 1).
 * @param pageSize - Items per page (default: 20).
 * @param status - Optional status filter ('confirmed', 'completed', 'cancelled', 'all').
 * @param search - Optional customer/provider search term.
 * @returns React Query result with paginated booking list.
 */
export const useBookingsQuery = (
  page = 1,
  pageSize = 20,
  status?: string,
  search?: string,
  service?: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, page, pageSize, status || 'all', search || '', service, startDate, endDate],
    queryFn: () => bookingApi.getBookings(page, pageSize, status, search, service, startDate, endDate),
  });
};

/**
 * Hook to fetch full booking details for a specific booking by ID.
 * 
 * @param id - Booking unique ID string.
 * @returns React Query result with Booking detail entity.
 */
export const useBookingDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, 'details', id],
    queryFn: () => bookingApi.getBookingById(id),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a new booking.
 */
export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: import('../bookings.types').CreateBookingRequest) =>
      bookingApi.createBooking(data),
    onSuccess: () => {
      // Invalidate bookings list to refetch
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });
};
