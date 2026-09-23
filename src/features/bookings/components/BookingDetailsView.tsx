import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  UserCheck,
  Mail,
  Phone,
  Layers,
  Activity,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import type { Booking, ServiceProgressStep } from '../bookings.types';
import { BookingStatus } from './BookingStatus';

interface BookingDetailsViewProps {
  booking: Booking;
}

export const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({ booking }) => {
  const bookingCode =
    booking.booking_code ||
    booking.reference_number ||
    `#${booking.id.slice(0, 8)}`;

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getServiceName = () => {
    if (typeof booking.service === 'string') return booking.service;
    return (
      booking.service?.name ||
      booking.service?.title ||
      booking.service_name ||
      booking.category_name ||
      'Standard Service'
    );
  };

  const getServiceCategory = () => {
    if (typeof booking.service === 'object' && booking.service?.category) {
      return booking.service.category;
    }
    return booking.category_name || 'General';
  };

  const getServiceDescription = () => {
    if (typeof booking.service === 'object' && booking.service?.description) {
      return booking.service.description;
    }
    return booking.notes || null;
  };

  const getAmountDisplay = () => {
    const amount = booking.amount ?? booking.total_amount ?? booking.escrow?.amount;
    const currency = booking.currency || booking.escrow?.currency || '€';
    if (amount === undefined || amount === null) return '—';
    return `${currency}${typeof amount === 'number' ? amount.toFixed(2) : amount}`;
  };

  // Build service progress milestones based on actual status
  const normalizedStatus = (booking.status || '').toUpperCase();
  const isCancelled =  normalizedStatus === 'CANCELED' || normalizedStatus === 'REJECTED';

  const progressSteps: ServiceProgressStep[] = [
    {
      key: 'REQUESTED',
      label: 'Booking Created',
      description: 'Customer submitted booking request',
      timestamp: booking.created_at,
      isCompleted: true,
      isCurrent: normalizedStatus === 'PENDING',
    },
    {
      key: 'ASSIGNED',
      label: 'Provider Request',
      description: booking.provider ? 'Customer selected a provider' : 'Waiting for provider selection',
      timestamp: null,
      isCompleted: Boolean(
        booking.provider ||
          booking.provider_id ||
          ['ACCEPTED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED'].includes(normalizedStatus)
      ),
      isCurrent: normalizedStatus === 'ASSIGNED',
    },
    {
      key: 'ACCEPTED',
      label: 'Offer Accepted',
      description: 'Provider accepted the job offer',
      timestamp: null,
      isCompleted: ['ACCEPTED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED'].includes(normalizedStatus),
      isCurrent: normalizedStatus === 'ACCEPTED',
    },
    {
      key: 'IN_PROGRESS',
      label: 'Service Started',
      description: 'Provider arrived & entered start code',
      timestamp: null,
      isCompleted: ['IN_PROGRESS', 'COMPLETED'].includes(normalizedStatus),
      isCurrent: normalizedStatus === 'IN_PROGRESS' || normalizedStatus === 'EN_ROUTE',
    },
    {
      key: 'COMPLETED',
      label: 'Service Completed',
      description: 'Provider entered completion code',
      timestamp: booking.completed_at,
      isCompleted: normalizedStatus === 'COMPLETED',
      isCurrent: normalizedStatus === 'COMPLETED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* TOP SUMMARY HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Booking {bookingCode}
              </h1>
              <BookingStatus status={booking.status} size="md" />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                Created: {formatDateTime(booking.created_at)}
              </span>
              {booking.scheduled_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  Scheduled: {formatDateTime(booking.scheduled_at)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl px-4 py-2.5 text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Total Price</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{getAmountDisplay()}</span>
            </div>
          </div>
        </div>

        {/* SERVICE PROGRESS STEPPER */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
              <span>Booking Progress Lifecycle</span>
            </h3>
            {isCancelled && (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800/50">
                Booking Cancelled / Terminated
              </span>
            )}
          </div>

          <div className="flex items-start w-full overflow-x-auto pb-4 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {progressSteps.map((step, idx) => {
              const isDone = !isCancelled && step.isCompleted;
              const isCurrent = !isCancelled && step.isCurrent;
              const isLast = idx === progressSteps.length - 1;

              return (
                <div key={step.key} className="relative flex flex-col items-center flex-1 min-w-[130px]">
                  {/* Connecting Line (drawn to the right of the current circle) */}
                  {!isLast && (
                    <div
                      className={`absolute top-4 left-[50%] w-full h-[2px] ${
                        isDone ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}

                  {/* Step Icon / Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white dark:bg-slate-900 transition-colors ${
                      isDone
                        ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : isCurrent
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Label and Description */}
                  <div className="mt-3 text-center px-2">
                    <h4
                      className={`text-xs font-bold mb-1 ${
                        isDone || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[120px] mx-auto leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CUSTOMER INFORMATION CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Information</h3>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold shrink-0 overflow-hidden">
              {booking.customer?.avatar_url ? (
                <img
                  src={booking.customer.avatar_url}
                  alt={booking.customer?.full_name || 'Customer'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {booking.customer?.full_name || booking.customer?.name || (booking.customer_id ? `Customer #${booking.customer_id.slice(0, 8)}` : 'Not Specified')}
              </h4>

              {booking.customer?.email && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">{booking.customer.email}</span>
                </div>
              )}

              {booking.customer?.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{booking.customer.phone}</span>
                </div>
              )}

              {(booking.service_address || booking.address || booking.location?.address) && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">
                    {booking.service_address || booking.address || booking.location?.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROVIDER INFORMATION CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <UserCheck className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Provider Information</h3>
          </div>

          {booking.provider || booking.provider_id ? (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold shrink-0 overflow-hidden">
                {booking.provider?.avatar_url ? (
                  <img
                    src={booking.provider.avatar_url}
                    alt={booking.provider?.full_name || 'Provider'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCheck className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {booking.provider?.full_name || booking.provider?.name || `Provider #${booking.provider_id?.slice(0, 8)}`}
                </h4>

                {booking.provider?.category && (
                  <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                    {booking.provider.category}
                  </div>
                )}

                {booking.provider?.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{booking.provider.email}</span>
                  </div>
                )}

                {booking.provider?.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{booking.provider.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">No Provider Assigned Yet</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs">
                This booking is waiting for provider assignment / acceptance.
              </p>
            </div>
          )}
        </div>

        {/* SERVICE INFORMATION CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service Details</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Service Name</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{getServiceName()}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Category</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{getServiceCategory()}</span>
            </div>

            {booking.scheduled_at && (
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Scheduled Schedule</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDateTime(booking.scheduled_at)}</span>
              </div>
            )}

            {getServiceDescription() && (
              <div className="pt-2">
                <span className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Notes / Instructions:</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-300 font-normal leading-relaxed text-[11px] border border-slate-100 dark:border-slate-800">
                  {getServiceDescription()}
                </p>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* PROVIDER ACTIVITIES TIMELINE (If provided by backend API) */}
      {booking.progress_history && booking.progress_history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Provider Activity Log</h3>
          </div>

          <div className="space-y-3">
            {booking.progress_history.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#006E1C] dark:bg-emerald-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activity.action}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatDateTime(activity.timestamp)}</span>
                  </div>
                  {activity.description && (
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">{activity.description}</p>
                  )}
                  {activity.note && (
                    <p className="text-slate-500 dark:text-slate-400 italic mt-0.5 text-[11px]">Note: {activity.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
