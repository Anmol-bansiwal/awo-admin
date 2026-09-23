import React from 'react';
import { Mail, Phone, MapPin, Calendar, Ban, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '../customers.types';
import { CustomerStatusBadge } from './CustomerStatus';
import { formatDateTime as formatDate } from '../../../utils/formatters';

interface CustomerDetailsViewProps {
  customer: Customer;
  onOpenSuspendModal: (customer: Customer) => void;
  onOpenReactivateModal: (customer: Customer) => void;
  hideBackButton?: boolean;
}

export const CustomerDetailsView: React.FC<CustomerDetailsViewProps> = ({
  customer,
  onOpenSuspendModal,
  onOpenReactivateModal,
  hideBackButton = false,
}) => {
  const navigate = useNavigate();
  const isApproved = (customer.status || '').toString().toUpperCase() === 'ACTIVE';

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    customer.full_name || 'User'
  )}&background=006E1C&color=fff`;

  const serviceLocations = customer.service_locations || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Optional Back Button */}
      {!hideBackButton && (
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Customer List
        </button>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center space-x-4">
          <img
            src={customer.avatar_url || fallbackAvatar}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
            }}
            alt={`${customer.full_name || 'Customer'} profile`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {customer.full_name || 'Customer'}
              </h1>
              <CustomerStatusBadge status={customer.status} />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{customer.email || '—'}</p>

            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold capitalize">
              <Shield className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span>{customer.role || 'customer'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto">
          {isApproved ? (
            <button
              type="button"
              onClick={() => onOpenSuspendModal(customer)}
              className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-semibold text-xs rounded-xl border border-rose-200 dark:border-rose-800/50 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <Ban className="w-4 h-4 text-rose-500" />
              <span>Suspend Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenReactivateModal(customer)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#EAF7EC] dark:bg-emerald-950/40 hover:bg-[#d8f3dc] dark:hover:bg-emerald-900/50 text-[#006E1C] dark:text-emerald-400 font-semibold text-xs rounded-xl border border-[#006E1C]/20 dark:border-emerald-800/40 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
              <span>Reactivate Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Contact Information
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Email Address</p>
                <p className="font-semibold text-slate-900 dark:text-white">{customer.email || '—'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Phone Number</p>
                <p className="font-semibold text-slate-900 dark:text-white font-mono">{customer.phone || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Account Information
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Created At</p>
                <p className="font-semibold text-slate-900 dark:text-white">{formatDate(customer.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Locations Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Service Locations</span>
        </h3>

        {serviceLocations.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
            No service locations available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {serviceLocations.map((loc) => (
              <div
                key={loc.id || Math.random().toString()}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white capitalize">
                    📍 {loc.label || loc.type || 'Location'}
                  </span>
                  {loc.type && (
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                      {loc.type}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed">
                  {loc.address || '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
