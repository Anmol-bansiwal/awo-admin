import React from 'react';
import { Calendar, Clock, User, UserCheck } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import type { Booking } from '../bookings.types';
import { BookingStatus } from './BookingStatus';
import { BookingActions } from './BookingActions';
import { formatDate as formatDateTime } from '../../../utils/formatters';

interface BookingTableProps {
  bookings: Booking[];
  totalBookings: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onViewDetails: (booking: Booking) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  totalBookings,
  currentPage,
  pageSize,
  onPageChange,
  isLoading,
  isError,
  errorMessage,
  onViewDetails,
}) => {

  const getCustomerName = (booking: Booking) => {
    return (
      booking.customer?.full_name ||
      booking.customer?.name ||
      (booking.customer_id ? `Customer #${booking.customer_id.slice(0, 6)}` : 'Not specified')
    );
  };

  const getProviderName = (booking: Booking) => {
    return (
      booking.provider?.full_name ||
      booking.provider?.name ||
      (booking.provider_id ? `Provider #${booking.provider_id.slice(0, 6)}` : 'Unassigned')
    );
  };

  const getServiceName = (booking: Booking) => {
    if (typeof booking.service === 'string') return booking.service;
    return (
      booking.service?.name ||
      booking.service?.title ||
      booking.service_name ||
      booking.category_name ||
      'Standard Service'
    );
  };

  const getAmountDisplay = (booking: Booking) => {
    const amount = booking.amount ?? booking.total_amount ?? booking.escrow?.amount;
    const currency = booking.currency || booking.escrow?.currency || '€';
    if (amount === undefined || amount === null) return null;
    return `${currency}${typeof amount === 'number' ? amount.toFixed(2) : amount}`;
  };

  const columns: ColumnDef<Booking>[] = [
    {
      key: 'booking_code',
      header: 'Booking',
      render: (booking) => {
        const bookingCode =
          booking.booking_code || booking.reference_number || `#${booking.id.slice(0, 8)}`;
        return (
          <div>
            <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>{bookingCode}</span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <span>{formatDateTime(booking.created_at || booking.scheduled_at)}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (booking) => {
        const customerName = getCustomerName(booking);
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-semibold text-[11px] shrink-0 overflow-hidden">
              {booking.customer?.avatar_url ? (
                <img
                  src={booking.customer.avatar_url}
                  alt={customerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                {customerName}
              </div>
              {booking.customer?.phone && (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                  {booking.customer.phone}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (booking) => {
        const providerName = getProviderName(booking);
        const isUnassigned = !booking.provider && !booking.provider_id;
        return (
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 overflow-hidden ${
                isUnassigned
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {booking.provider?.avatar_url ? (
                <img
                  src={booking.provider.avatar_url}
                  alt={providerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <div
                className={`font-semibold truncate max-w-[140px] ${
                  isUnassigned
                    ? 'text-amber-700 dark:text-amber-400 italic'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {providerName}
              </div>
              {booking.provider?.category && (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                  {booking.provider.category}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'service',
      header: 'Service',
      render: (booking) => (
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
            {getServiceName(booking)}
          </div>
          {booking.service_address || booking.address ? (
            <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
              {booking.service_address || booking.address}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Price',
      render: (booking) => {
        const amount = getAmountDisplay(booking);
        return amount ? (
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{amount}</span>
            {/* Escrow hidden for now until gateway integration is complete
            {booking.escrow?.status && (
              <span className="block text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500">
                {booking.escrow.status}
              </span>
            )}
            */}
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 font-normal">—</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => <BookingStatus status={booking.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (booking) => (
        <div onClick={(e) => e.stopPropagation()}>
          <BookingActions booking={booking} onViewDetails={onViewDetails} />
        </div>
      ),
    },
  ];

  return (
    <DataTable<Booking>
      data={bookings}
      columns={columns}
      keyExtractor={(b) => b.id}
      onRowClick={onViewDetails}
      isLoading={isLoading}
      loadingMessage="Loading bookings..."
      isError={isError}
      errorMessage={errorMessage}
      emptyTitle="No bookings found"
      emptyMessage="There are no bookings matching the selected criteria."
      emptyIcon={<Calendar className="w-7 h-7 text-slate-400 dark:text-slate-500" />}
      pagination={{
        currentPage,
        pageSize,
        totalItems: totalBookings,
        onPageChange,
        itemName: 'bookings',
      }}
    />
  );
};
