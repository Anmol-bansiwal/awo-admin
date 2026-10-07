import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck,
  FileText,
  Eye,
  MapPin,
  CheckCircle2,
  Ban,
  Loader2,
  AlertCircle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Camera,
  RefreshCw,
  Info,
  Clock,
  UserX,
} from 'lucide-react';
import type { Provider, KycRejectionReasonCode } from '../providers.types';
import { KYC_REJECTION_REASONS } from '../providers.types';
import {
  useProviderKycQuery,
  useApproveKycMutation,
  useRejectKycMutation,
  useResubmitKycMutation,
  useResetKycAttemptsMutation,
} from '../hooks/useProviders';
import { ProviderKycStatusBadge } from './ProviderStatus';
import { formatDateTime } from '../../../utils/formatters';

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

  // Rejection sub-form state
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReasonCode, setRejectReasonCode] = useState<KycRejectionReasonCode>('selfie_mismatch');
  const [rejectNote, setRejectNote] = useState('');

  // Reset confirmation state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Queries and mutations
  const {
    data: kycData,
    isLoading: isKycLoading,
    isError: isKycError,
    error: kycFetchError,
    refetch: refetchKyc,
    isFetching: isKycFetching,
  } = useProviderKycQuery(provider?.id || '');

  const approveMutation = useApproveKycMutation();
  const rejectMutation = useRejectKycMutation();
  const resubmitMutation = useResubmitKycMutation();
  const resetAttemptsMutation = useResetKycAttemptsMutation();

  const isPendingAction =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    resubmitMutation.isPending ||
    resetAttemptsMutation.isPending;

  // Reset state on modal open/provider change
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsRejectOpen(false);
      setIsResetConfirmOpen(false);
      setRejectReasonCode('selfie_mismatch');
      setRejectNote('');
    }
  }, [isOpen, provider?.id]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !previewImageUrl && !isPendingAction) {
        if (isRejectOpen) {
          setIsRejectOpen(false);
        } else if (isResetConfirmOpen) {
          setIsResetConfirmOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, previewImageUrl, isPendingAction, isRejectOpen, isResetConfirmOpen, onClose]);

  if (!isOpen || !provider) return null;

  const profile = provider.provider;
  const addressProofUrl = profile?.address_proof_url;

  // Current effective KYC status (prefer live KYC query, fallback to profile/provider)
  const currentKycStatus = (
    kycData?.kyc_status ||
    profile?.kyc_status ||
    provider.kyc_status ||
    'pending'
  )
    .trim()
    .toLowerCase();

  const attemptsUsed = kycData?.attempts_used ?? profile?.kyc_attempts ?? 0;
  const maxAttempts = kycData?.max_attempts ?? 3;
  const latestSession = kycData?.latest_session;
  const decision = kycData?.decision;

  const selectedReasonObj =
    KYC_REJECTION_REASONS.find((r) => r.code === rejectReasonCode) || KYC_REJECTION_REASONS[0];

  // Actions
  const handleApprove = async () => {
    setErrorMessage(null);
    try {
      await approveMutation.mutateAsync(provider.id);
      onClose();
      onSuccess?.(`KYC for provider "${provider.full_name || provider.phone}" has been approved.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to approve KYC. Please check if identity verification has passed.');
    }
  };

  const handleConfirmReject = async () => {
    setErrorMessage(null);
    try {
      await rejectMutation.mutateAsync({
        id: provider.id,
        payload: {
          reason_code: rejectReasonCode,
          note: rejectNote.trim() ? rejectNote.trim().slice(0, 500) : undefined,
        },
      });
      setIsRejectOpen(false);
      onClose();
      onSuccess?.(`KYC for provider "${provider.full_name || provider.phone}" has been rejected.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reject KYC. Please verify the rejection reason.');
    }
  };

  const handleResubmit = async () => {
    setErrorMessage(null);
    try {
      await resubmitMutation.mutateAsync(provider.id);
      onSuccess?.(`Requested provider "${provider.full_name || provider.phone}" to redo failed verification steps.`);
      refetchKyc();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to request KYC resubmission.');
    }
  };

  const handleResetAttempts = async () => {
    setErrorMessage(null);
    try {
      await resetAttemptsMutation.mutateAsync(provider.id);
      setIsResetConfirmOpen(false);
      onSuccess?.(`KYC verification attempts have been reset back to 3 for "${provider.full_name || provider.phone}".`);
      refetchKyc();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reset KYC attempts.');
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

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#38B449] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-[#38B449]/20 dark:border-emerald-800/40">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {provider.full_name || 'Provider'}
                </h2>
                <ProviderKycStatusBadge kycStatus={currentKycStatus} />
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Attempts: {attemptsUsed}/{maxAttempts}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {provider.phone} • {provider.email || 'No email provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={isKycFetching}
              onClick={() => refetchKyc()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Refresh KYC session and image links"
            >
              <RefreshCw className={`w-4 h-4 ${isKycFetching ? 'animate-spin text-[#38B449]' : ''}`} />
            </button>
            <button
              type="button"
              disabled={isPendingAction}
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-40"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-400 text-xs flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {isKycLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#38B449]" />
              <p className="text-xs font-medium text-slate-500">Loading Didit KYC verification data...</p>
            </div>
          ) : isKycError && !kycData ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-2">
              <p className="font-semibold">Unable to retrieve live KYC verification record.</p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                {(kycFetchError as any)?.message || 'Endpoint returned an error.'}
              </p>
              <button
                type="button"
                onClick={() => refetchKyc()}
                className="mt-2 px-3 py-1 bg-rose-100 dark:bg-rose-900/50 rounded-lg font-bold text-xs"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Previous Decision Banner (if already decided) */}
              {decision && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    decision.action === 'approved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                  }`}
                >
                  {decision.action === 'approved' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <UserX className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold capitalize text-sm">
                        Decision: {decision.action}
                      </span>
                      {decision.at && (
                        <span className="text-[11px] opacity-80">
                          • {formatDateTime(decision.at)}
                        </span>
                      )}
                    </div>
                    {decision.by?.name && (
                      <p className="text-[11px] opacity-90">
                        Decided by: <strong>{decision.by.name}</strong>
                      </p>
                    )}
                    {decision.rejection && (
                      <div className="mt-1 pt-1 border-t border-rose-200/60 dark:border-rose-800/60 text-[11px] space-y-0.5">
                        <p>
                          <strong>Reason:</strong> {decision.rejection.message} ({decision.rejection.code})
                        </p>
                        {decision.rejection.note && (
                          <p className="italic">
                            <strong>Admin note:</strong> {decision.rejection.note}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Session State */}
              {!latestSession && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-3">
                  <Info className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Didit Verification Not Started
                    </p>
                    <p className="text-[11px]">
                      The provider has not yet initiated their Didit identity verification session.
                    </p>
                  </div>
                </div>
              )}

              {/* Warnings Section */}
              {latestSession?.warnings && latestSession.warnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Verification Warnings ({latestSession.warnings.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {latestSession.warnings.map((warn, i) => {
                      const sev = (warn.severity || 'warning').toLowerCase();
                      const isError = sev === 'error';
                      const isWarning = sev === 'warning';

                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                            isError
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                              : isWarning
                              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 mt-0.5 ${
                              isError
                                ? 'bg-rose-200/80 text-rose-900'
                                : isWarning
                                ? 'bg-amber-200/80 text-amber-900'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {warn.severity}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-xs">{warn.short_description}</p>
                            <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                              {warn.long_description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Scores & Verification Metrics */}
              {latestSession?.scores && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Face Match Score
                      </span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {latestSession.scores.face_match != null ? `${latestSession.scores.face_match}/100` : '—'}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                      👤
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Liveness Score
                      </span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {latestSession.scores.liveness != null ? `${latestSession.scores.liveness}/100` : '—'}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                      ✨
                    </div>
                  </div>
                </div>
              )}

              {/* ID Document Details & Name Match */}
              {latestSession?.id_document && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#38B449]" />
                      <span>ID Document Information</span>
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {latestSession.id_document.document_type || 'Identity Card'}
                    </span>
                  </div>

                  {/* Name Match Warning */}
                  {latestSession.id_document.name_matches_profile === false && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">⚠️ ID name differs from profile</p>
                        <p className="text-[11px] mt-0.5">
                          Profile name: <strong>{provider.full_name || '—'}</strong> | ID Document name:{' '}
                          <strong>{latestSession.id_document.full_name || '—'}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Full Name on ID
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {latestSession.id_document.full_name || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Date of Birth
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {latestSession.id_document.date_of_birth || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Document Number
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {latestSession.id_document.document_number || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Nationality
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {latestSession.id_document.nationality || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Issuing Country
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {latestSession.id_document.issuing_country || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block">
                        Expiration Date
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {latestSession.id_document.expiration_date || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* IP & Device Intelligence */}
              {latestSession?.ip && (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>
                      Country: <strong>{latestSession.ip.country || 'Unknown'}</strong> (Platform: {latestSession.ip.platform || 'Unknown'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {latestSession.ip.is_vpn_or_tor && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold text-[10px]">
                        VPN / Tor Detected
                      </span>
                    )}
                    {latestSession.ip.is_data_center && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[10px]">
                        Data Center IP
                      </span>
                    )}
                    {!latestSession.ip.is_vpn_or_tor && !latestSession.ip.is_data_center && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[10px]">
                        Clean Residential Connection
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Verification Images (Didit & Address Proof) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#38B449]" />
                    <span>Verification Images</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Links are temporary signed URLs
                  </span>
                </div>

                {latestSession?.images_available === false && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
                    Images temporarily unavailable from verification provider.
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* ID Front */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">ID Front</span>
                    {latestSession?.images?.id_front ? (
                      <div
                        onClick={() => setPreviewImageUrl(latestSession.images!.id_front!)}
                        className="h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer group relative"
                      >
                        <img
                          src={latestSession.images.id_front}
                          alt="ID Front"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-[11px]">
                        No ID front
                      </div>
                    )}
                  </div>

                  {/* ID Back */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">ID Back</span>
                    {latestSession?.images?.id_back ? (
                      <div
                        onClick={() => setPreviewImageUrl(latestSession.images!.id_back!)}
                        className="h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer group relative"
                      >
                        <img
                          src={latestSession.images.id_back}
                          alt="ID Back"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-[11px]">
                        No ID back
                      </div>
                    )}
                  </div>

                  {/* ID Portrait */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">ID Portrait</span>
                    {latestSession?.images?.id_portrait ? (
                      <div
                        onClick={() => setPreviewImageUrl(latestSession.images!.id_portrait!)}
                        className="h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer group relative"
                      >
                        <img
                          src={latestSession.images.id_portrait}
                          alt="ID Portrait"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-[11px]">
                        No portrait
                      </div>
                    )}
                  </div>

                  {/* Selfie */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Live Selfie</span>
                    {latestSession?.images?.selfie ? (
                      <div
                        onClick={() => setPreviewImageUrl(latestSession.images!.selfie!)}
                        className="h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer group relative"
                      >
                        <img
                          src={latestSession.images.selfie}
                          alt="Selfie"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-[11px]">
                        No selfie
                      </div>
                    )}
                  </div>
                </div>

                {/* Proof of Address Section */}
                <div className="pt-2">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#38B449]" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          Proof of Address Document
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[#38B449] border border-[#38B449]/20">
                        Admin Review Required
                      </span>
                    </div>

                    {addressProofUrl ? (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500 truncate max-w-xs">
                          {addressProofUrl}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewImageUrl(addressProofUrl)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Proof of Address</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        No proof of address uploaded yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions: Configured strictly per user decision table */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-semibold text-slate-500">
            {currentKycStatus === 'approved' && (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                KYC is approved and active.
              </span>
            )}
            {(currentKycStatus === 'pending' || currentKycStatus === 'in_progress') && (
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Waiting for the provider to complete verification.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Case: rejected -> Show Reset attempts */}
            {currentKycStatus === 'rejected' && (
              <button
                type="button"
                disabled={isPendingAction}
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Attempts</span>
              </button>
            )}

            {/* Case: declined -> Show Ask to redo (if attempts left), Reject, Reset attempts */}
            {currentKycStatus === 'declined' && (
              <>
                <button
                  type="button"
                  disabled={isPendingAction}
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Attempts</span>
                </button>

                {attemptsUsed < maxAttempts && (
                  <button
                    type="button"
                    disabled={isPendingAction}
                    onClick={handleResubmit}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    {resubmitMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>Ask to Redo</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isPendingAction}
                  onClick={() => setIsRejectOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Ban className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {/* Case: in_review -> Show Approve, Ask to redo, Reject */}
            {currentKycStatus === 'in_review' && (
              <>
                <button
                  type="button"
                  disabled={isPendingAction}
                  onClick={() => setIsRejectOpen(true)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  disabled={isPendingAction}
                  onClick={handleResubmit}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  {resubmitMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Ask to Redo</span>
                </button>

                <button
                  type="button"
                  disabled={isPendingAction}
                  onClick={handleApprove}
                  className="px-5 py-2 bg-brand-gradient hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Approve KYC</span>
                </button>
              </>
            )}

            {/* Case: pending_admin_approval -> Show Approve, Reject */}
            {currentKycStatus === 'pending_admin_approval' && (
              <>
                <button
                  type="button"
                  disabled={isPendingAction}
                  onClick={() => setIsRejectOpen(true)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  disabled={isPendingAction}
                  onClick={handleApprove}
                  className="px-5 py-2 bg-brand-gradient hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Approve KYC</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal Dialog */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Reject KYC Verification</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  value={rejectReasonCode}
                  onChange={(e) => setRejectReasonCode(e.target.value as KycRejectionReasonCode)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {KYC_REJECTION_REASONS.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Message the provider sees
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  "{selectedReasonObj.userMessage}"
                </p>
              </div>

              {/* Admin Note */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Internal Note{' '}
                  <span className="font-normal text-slate-400">(Optional, admin only)</span>
                </label>
                <textarea
                  value={rejectNote}
                  maxLength={500}
                  rows={3}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Internal rationale for audit log (providers will never see this note)..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                />
                <span className="text-[10px] text-slate-400 text-right block mt-0.5">
                  {rejectNote.length}/500
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsRejectOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={rejectMutation.isPending}
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {rejectMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Reset KYC Attempts?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This will grant the provider 3 fresh attempts and set their KYC status back to pending.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetAttemptsMutation.isPending}
                onClick={handleResetAttempts}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {resetAttemptsMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
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
              alt="Verification Document Preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-700 bg-slate-900"
            />
          </div>
        </div>
      )}
    </div>
  );
};
