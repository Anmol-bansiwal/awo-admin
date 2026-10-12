import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Booking } from '../bookings.types';
import { useBookingsQuery } from '../hooks/useBookings';
import { BookingTable } from '../components/BookingTable';
import { BookingFilters } from '../components/BookingFilters';
import { BookingDetailsDrawer } from '../components/BookingDetailsDrawer';

const PAGE_SIZE = 20;

export const Bookings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get('status')?.toLowerCase();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(() => {
    if (urlStatus && ['all', 'active', 'in_progress', 'pending', 'completed', 'cancelled'].includes(urlStatus)) {
      return urlStatus;
    }
    return 'all';
  });

  // Sync with URL query parameter changes
  useEffect(() => {
    if (urlStatus && ['all', 'active', 'in_progress', 'pending', 'completed', 'cancelled'].includes(urlStatus)) {
      setSelectedStatus(urlStatus);
      setPage(1);
    }
  }, [urlStatus]);

  // Booking Details Drawer State (slide-over without route change)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, isError } = useBookingsQuery(
    page,
    PAGE_SIZE,
    selectedStatus !== 'all' && selectedStatus !== 'active' ? selectedStatus.toUpperCase() : undefined,
    debouncedSearch.trim() || undefined
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (status === 'all') {
        next.delete('status');
      } else {
        next.set('status', status);
      }
      return next;
    });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const rawBookings: Booking[] = data?.data || [];

  // Client-side fallback for 'active' status since standard API might not natively support a combined 'active' enum
  const filteredBookings = rawBookings.filter((booking) => {
    if (selectedStatus === 'active') {
      const normalizedStatus = (booking.status || '').toLowerCase();
      return [
        'active',
        'in_progress',
        'inprogress',
        'en_route',
        'enroute',
        'assigned',
        'accepted',
        'pending',
      ].includes(normalizedStatus);
    }
    return true;
  });

  // Handle various potential API pagination response formats
  const totalBookings =
    (data as any)?.meta?.total_count ??
    data?.metadata?.total ??
    (selectedStatus === 'active' ? filteredBookings.length : (data?.data ? data.data.length : 0));

  return (
    <div className="space-y-6">
      {/* Search and Status Filters */}
      <BookingFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />

      {/* Main Booking List Table */}
      <BookingTable
        bookings={filteredBookings}
        totalBookings={totalBookings}
        currentPage={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onViewDetails={handleViewDetails}
      />

      {/* Right-Side Booking Details Drawer */}
      <BookingDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedBooking(null);
        }}
        bookingId={selectedBooking?.id ?? null}
        initialBooking={selectedBooking}
      />
    </div>
  );
};
