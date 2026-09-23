import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { Provider } from '../providers.types';
import {
  useProviderDetailsQuery,
  useSuspendProviderMutation,
  useReactivateProviderMutation,
} from '../hooks/useProviders';
import { ProviderDetailsView } from '../components/ProviderDetailsView';
import { ProviderConfirmModal } from '../components/ProviderConfirmModal';
import { ProviderKycModal } from '../components/ProviderKycModal';
import { AwoLoader } from '../../../components/AwoLoader';

export const ProviderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalAction, setModalAction] = useState<'suspend' | 'reactivate'>('suspend');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // KYC State
  const [selectedKycProvider, setSelectedKycProvider] = useState<Provider | null>(null);
  const [isKycOpen, setIsKycOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const { data: provider, isLoading, isError, error } = useProviderDetailsQuery(id || '');
  const suspendMutation = useSuspendProviderMutation();
  const reactivateMutation = useReactivateProviderMutation();

  const handleOpenSuspendModal = (prov: Provider) => {
    setSelectedProvider(prov);
    setModalAction('suspend');
    setIsModalOpen(true);
  };

  const handleOpenReactivateModal = (prov: Provider) => {
    setSelectedProvider(prov);
    setModalAction('reactivate');
    setIsModalOpen(true);
  };

  const handleOpenKycModal = (prov: Provider) => {
    setSelectedKycProvider(prov);
    setIsKycOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedProvider) return;

    try {
      if (modalAction === 'suspend') {
        await suspendMutation.mutateAsync(selectedProvider.id);
        showToast('success', `Provider "${selectedProvider.full_name || selectedProvider.phone}" has been suspended.`);
      } else {
        await reactivateMutation.mutateAsync(selectedProvider.id);
        showToast('success', `Provider "${selectedProvider.full_name || selectedProvider.phone}" has been reactivated.`);
      }
      setIsModalOpen(false);
      setSelectedProvider(null);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to update provider status.');
    }
  };

  const isActionPending = suspendMutation.isPending || reactivateMutation.isPending;

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <AwoLoader size="sm" message="Loading provider details..." />
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <div>
          <h3 className="text-base font-bold text-slate-900">Provider Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {error?.message || 'The requested provider profile could not be retrieved from the server.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/providers')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Provider List</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`mb-4 p-4 rounded-xl border flex items-center space-x-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{toastMessage.text}</span>
        </div>
      )}

      <ProviderDetailsView
        provider={provider}
        onOpenSuspendModal={handleOpenSuspendModal}
        onOpenReactivateModal={handleOpenReactivateModal}
        onOpenKycModal={handleOpenKycModal}
      />

      <ProviderKycModal
        isOpen={isKycOpen}
        provider={selectedKycProvider}
        onClose={() => {
          setIsKycOpen(false);
          setSelectedKycProvider(null);
        }}
        onSuccess={(msg) => showToast('success', msg)}
      />

      <ProviderConfirmModal
        isOpen={isModalOpen}
        actionType={modalAction}
        provider={selectedProvider}
        isLoading={isActionPending}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};
