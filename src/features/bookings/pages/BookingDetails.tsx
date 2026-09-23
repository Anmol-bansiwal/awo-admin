import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useBookingDetailsQuery } from '../hooks/useBookings';
import { BookingDetailsView } from '../components/BookingDetailsView';

export const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useBookingDetailsQuery(id || '');

  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <div>
          <h3 className="text-base font-bold text-slate-900">Booking Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            The requested booking records could not be retrieved.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bookings List</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Bookings</span>
        </button>
      </div>

      {/* Main Details & Monitoring View */}
      <BookingDetailsView booking={booking} />
    </div>
  );
};
