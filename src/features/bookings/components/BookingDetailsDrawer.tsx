import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBookingDetailsQuery, BOOKINGS_QUERY_KEY } from '../hooks/useBookings';
import { BookingDetailsView } from './BookingDetailsView';
import { DetailsDrawer } from '../../../components/DetailsDrawer';
import type { Booking } from '../bookings.types';

interface BookingDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  initialBooking?: Booking | null;
}

export const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
  isOpen,
  onClose,
  bookingId,
  initialBooking,
}) => {
  const queryClient = useQueryClient();
  const activeBookingId = isOpen && bookingId ? bookingId : '';
  const { data: apiBooking, isLoading, isError, error } = useBookingDetailsQuery(activeBookingId);

  // Keep the list cache in sync when fresh details are loaded
  useEffect(() => {
    if (apiBooking) {
      queryClient.setQueriesData({ queryKey: BOOKINGS_QUERY_KEY }, (oldData: any) => {
        if (!oldData) return oldData;
        
        // Handle direct array format
        if (Array.isArray(oldData)) {
          return oldData.map((b: Booking) => (b.id === apiBooking.id ? { ...b, ...apiBooking } : b));
        }
        
        // Handle paginated format { data: Booking[], metadata: ... }
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((b: Booking) => (b.id === apiBooking.id ? { ...b, ...apiBooking } : b))
          };
        }
        return oldData;
      });
    }
  }, [apiBooking, queryClient]);

  const booking: Booking | undefined = apiBooking || initialBooking || undefined;

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Details"
      subtitle="View live mission progress, escrow status, customer & provider information."
      maxWidthClassName="max-w-3xl"
      isLoading={isLoading && !booking}
      loadingMessage="Loading booking details..."
      isError={!isLoading && isError && !booking}
      errorMessage={error?.message || 'The requested booking details could not be retrieved from the server.'}
    >
      {booking && <BookingDetailsView booking={booking} />}
    </DetailsDrawer>
  );
};
