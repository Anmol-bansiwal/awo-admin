import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck,
  FileText,
  Eye,
  MapPin,
  CheckCircle2,
  Ban,
  Wrench,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Provider } from '../providers.types';
import { useApproveKycMutation, useRejectKycMutation } from '../hooks/useProviders';
import { ProviderKycStatusBadge } from './ProviderStatus';

interface ProviderKycModalProps {
  isOpen: boolean;
  provider: Provider | null;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

export const ProviderKycModal: React.FC<ProviderKycModalProps> = ({
  isOpen,
  provider,
  onClose,
  onSuccess,
}) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const approveMutation = useApproveKycMutation();
  const rejectMutation = useRejectKycMutation();

  const isPendingAction = approveMutation.isPending || rejectMutation.isPending;

  // Reset error when modal opens with new provider
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen, provider?.id]);

  // Close on ESC key press & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !previewImageUrl && !isPendingAction) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, previewImageUrl, isPendingAction, onClose]);

  if (!isOpen || !provider) return null;

  const profile = provider.provider;
  const skills = profile?.skills || [];
  const serviceAreas = provider.service_areas || [];
  const kycStatus = profile?.kyc_status || 'pending';

  // Primary location text
  const primaryLocation =
    serviceAreas.length > 0
      ? serviceAreas[0].address || serviceAreas[0].label || '—'
      : '—';

  const handleApprove = async () => {
    setErrorMessage(null);
    try {
      await approveMutation.mutateAsync(provider.id);
      onClose();
      onSuccess?.(`KYC for provider "${provider.full_name || provider.phone}" has been approved.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to approve KYC. Please try again.');
    }
  };

  const handleReject = async () => {
    setErrorMessage(null);
    try {
      await rejectMutation.mutateAsync(provider.id);
      onClose();
      onSuccess?.(`KYC for provider "${provider.full_name || provider.phone}" has been rejected.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reject KYC. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop Overlay */}
      <div
        onClick={!isPendingAction ? onClose : undefined}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card (Fixed Centered) */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 flex flex-col transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-[#006E1C]/20 dark:border-emerald-800/40">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Provider KYC Verification
                </h2>
                <ProviderKycStatusBadge kycStatus={kycStatus} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Review identity credentials & service verification documents
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isPendingAction}
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-40"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-400 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Section 1: Provider Information */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Provider Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{provider.full_name || '—'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">Phone</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {provider.phone || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">Location</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {primaryLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Identity Document */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Identity Document: {profile?.identity_type?.name || 'Ghana Card'}
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 border border-[#006E1C]/20 dark:border-emerald-800/40">
                Identity Proof
              </span>
            </div>

            {/* Document Preview Area (Front & Back) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Front Side */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Front Side</span>
                {profile?.identity_front_url ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <img
                      src={profile.identity_front_url}
                      alt="Identity Front Document"
                      className="w-full h-32 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setPreviewImageUrl(profile.identity_front_url!)}
                    />
                    <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewImageUrl(profile.identity_front_url!)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[11px] italic bg-slate-50 dark:bg-slate-800/40">
                    Front side unavailable
                  </div>
                )}
              </div>

              {/* Back Side */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Back Side</span>
                {profile?.identity_back_url ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <img
                      src={profile.identity_back_url}
                      alt="Identity Back Document"
                      className="w-full h-32 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setPreviewImageUrl(profile.identity_back_url!)}
                    />
                    <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewImageUrl(profile.identity_back_url!)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[11px] italic bg-slate-50 dark:bg-slate-800/40">
                    Back side unavailable
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Address Proof */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Address Proof Document</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 border border-[#006E1C]/20 dark:border-emerald-800/40">
                Address Proof
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {profile?.address_proof_url ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <img
                    src={profile.address_proof_url}
                    alt="Address Proof Document"
                    className="w-full h-32 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => setPreviewImageUrl(profile.address_proof_url!)}
                  />
                  <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPreviewImageUrl(profile.address_proof_url!)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-32 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[11px] italic bg-slate-50 dark:bg-slate-800/40">
                  Address proof unavailable
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Services & Details */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Wrench className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Services, Skills & Certification</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Certification Status:</span>
                <span className="font-semibold text-slate-900 dark:text-white uppercase">
                  {profile?.certification_status || 'Obtained'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Accepting Requests:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {profile?.accepting_requests !== false ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {skills.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 italic text-xs">No services listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 rounded-xl bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 border border-[#006E1C]/20 dark:border-emerald-800/40 font-semibold text-xs flex items-center space-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006E1C] dark:bg-emerald-400"></span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions: [ Reject KYC ] & [ Approve KYC ] */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <button
            type="button"
            disabled={isPendingAction}
            onClick={handleReject}
            className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 disabled:opacity-50 text-rose-700 dark:text-rose-400 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-800/50 transition-colors flex items-center space-x-2 cursor-pointer shadow-2xs"
          >
            {rejectMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
            ) : (
              <Ban className="w-4 h-4 text-rose-500" />
            )}
            <span>Reject KYC</span>
          </button>

          <button
            type="button"
            disabled={isPendingAction}
            onClick={handleApprove}
            className="px-5 py-2.5 bg-[#006E1C] hover:bg-[#005716] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-2 cursor-pointer"
          >
            {approveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white" />
            )}
            <span>Approve KYC</span>
          </button>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImageUrl}
              alt="Document Full Preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-700 bg-slate-900"
            />
          </div>
        </div>
      )}
    </div>
  );
};
