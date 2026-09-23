import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Ban,
  CheckCircle2,
  ArrowLeft,
  Shield,
  FileCheck,
  Award,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Provider } from '../providers.types';
import { ProviderStatusBadge, ProviderKycStatusBadge } from './ProviderStatus';
import { formatDateTime as formatDate } from '../../../utils/formatters';

interface ProviderDetailsViewProps {
  provider: Provider;
  onOpenSuspendModal: (provider: Provider) => void;
  onOpenReactivateModal: (provider: Provider) => void;
  onOpenKycModal?: (provider: Provider) => void;
  hideBackButton?: boolean;
}

export const ProviderDetailsView: React.FC<ProviderDetailsViewProps> = ({
  provider,
  onOpenSuspendModal,
  onOpenReactivateModal,
  onOpenKycModal,
  hideBackButton = false,
}) => {
  const navigate = useNavigate();
  const isApproved = (provider.status || '').toString().toUpperCase() === 'ACTIVE';

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    provider.full_name || 'Provider'
  )}&background=006E1C&color=fff`;

  const formatYearsExperience = (val?: string | null): string => {
    if (!val) return '—';
    let str = val.trim();

    if (str.startsWith('y')) {
      str = str.substring(1);
    }

    if (str.includes('10_plus') || str.includes('10plus')) {
      return '10+ years';
    }

    str = str.replace(/_/g, '-');

    if (str.toLowerCase().includes('year')) {
      return str;
    }

    return `${str} years`;
  };

  const profile = provider.provider;
  const skills = profile?.skills || [];
  const serviceAreas = provider.service_areas || [];

  return (
    <div className="space-y-3 max-w-4xl mx-auto relative">
      {/* Optional Back Button */}
      {!hideBackButton && (
        <button
          onClick={() => navigate('/providers')}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Provider List
        </button>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center space-x-4">
          <img
            src={provider.avatar_url || fallbackAvatar}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
            }}
            alt={`${provider.full_name || 'Provider'} profile`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-md shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {provider.full_name || 'Provider'}
              </h1>
              <ProviderStatusBadge status={provider.status} />
              <ProviderKycStatusBadge kycStatus={profile?.kyc_status} />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{provider.email || '—'}</p>

            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold capitalize">
              <Shield className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span>{provider.role || 'provider'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
          {onOpenKycModal && (
            <button
              type="button"
              onClick={() => onOpenKycModal(provider)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#EAF7EC] dark:bg-emerald-950/40 hover:bg-[#d8f3dc] dark:hover:bg-emerald-900/50 text-[#006E1C] dark:text-emerald-400 font-semibold text-xs rounded-xl border border-[#006E1C]/30 dark:border-emerald-800/40 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <FileCheck className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
              <span>Check KYC</span>
            </button>
          )}

          {isApproved ? (
            <button
              type="button"
              onClick={() => onOpenSuspendModal(provider)}
              className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-semibold text-xs rounded-xl border border-rose-200 dark:border-rose-800/50 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <Ban className="w-4 h-4 text-rose-500" />
              <span>Suspend Provider</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenReactivateModal(provider)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#EAF7EC] dark:bg-emerald-950/40 hover:bg-[#d8f3dc] dark:hover:bg-emerald-900/50 text-[#006E1C] dark:text-emerald-400 font-semibold text-xs rounded-xl border border-[#006E1C]/20 dark:border-emerald-800/40 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
              <span>Reactivate Provider</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Contact Info & Account Info */}
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
                <p className="font-semibold text-slate-900 dark:text-white">{provider.email || '—'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Phone Number</p>
                <p className="font-semibold text-slate-900 dark:text-white font-mono">{provider.phone || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
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
                <p className="font-semibold text-slate-900 dark:text-white">{formatDate(provider.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Certification Status</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-0.5">
                  {profile?.certification_status || 'Uncertified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Profile Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5 transition-colors">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Professional Profile</span>
        </h3>

        {!profile ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">Provider information unavailable.</p>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Bio */}
            <div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-1">Bio / Overview</p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {profile.bio || 'No provider bio available.'}
              </p>
            </div>

            {/* Experience & Regular Clients Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Years of Experience</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {formatYearsExperience(profile.years_experience)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Regular Clients</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {profile.regular_clients || '—'}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-1.5">Skills & Specialties</p>
              {skills.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 italic">No skills listed.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-lg bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 border border-[#006E1C]/20 dark:border-emerald-800/40 font-medium text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Service Areas Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Service Areas</span>
        </h3>

        {serviceAreas.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
            No service areas available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {serviceAreas.map((area) => (
              <div
                key={area.id || Math.random().toString()}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white capitalize">
                    📍 {area.label || area.type || 'Service Area'}
                  </span>
                  {area.type && (
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                      {area.type}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed">
                  {area.address || '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
