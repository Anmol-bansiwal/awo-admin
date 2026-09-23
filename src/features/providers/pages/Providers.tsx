import React, { useState } from 'react';
import type { Provider } from '../providers.types';
import {
  useProvidersQuery,
  useSuspendProviderMutation,
  useReactivateProviderMutation,
} from '../hooks/useProviders';
import { UserTable } from '../../../components/UserTable';
import { ProviderStatusBadge } from '../components/ProviderStatus';
import { ProviderActions } from '../components/ProviderActions';
import { ProviderConfirmModal } from '../components/ProviderConfirmModal';
import { UserDetailsDrawer } from '../../../components/UserDetailsDrawer';
import { ProviderKycModal } from '../components/ProviderKycModal';

const PAGE_SIZE = 20;

/**
 * Main provider management page.
 * - Displays paginated service providers list with live search filtering.
 * - Handles account status changes (suspend, reactivate) and KYC review modals.
 * - Opens provider details slide-over drawer.
 */
export const Providers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalAction, setModalAction] = useState<'suspend' | 'reactivate'>('suspend');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drawer State for viewing provider details on the same page
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // KYC Verification Modal State
  const [selectedKycProvider, setSelectedKycProvider] = useState<Provider | null>(null);
  const [isKycOpen, setIsKycOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /**
   * Displays temporary toast notification.
   */
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const { data, isLoading, isError, error } = useProvidersQuery(page, PAGE_SIZE);
  const suspendMutation = useSuspendProviderMutation();
  const reactivateMutation = useReactivateProviderMutation();

  /**
   * Opens confirmation modal configured for provider suspension.
   */
  const handleOpenSuspendModal = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalAction('suspend');
    setIsModalOpen(true);
  };

  /**
   * Opens confirmation modal configured for provider reactivation.
   */
  const handleOpenReactivateModal = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalAction('reactivate');
    setIsModalOpen(true);
  };

  /**
   * Opens the KYC review modal for a specific provider.
   */
  const handleOpenKycModal = (provider: Provider) => {
    setSelectedKycProvider(provider);
    setIsKycOpen(true);
  };

  /**
   * Opens the slide-over details drawer for a specific provider.
   */
  const handleViewDetails = (provider: Provider) => {
    setSelectedProviderId(provider.id);
    setIsDrawerOpen(true);
  };

  /**
   * Submits the suspend or reactivate mutation for the selected provider.
   */
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

  const rawProviders: Provider[] = data?.data || [];

  const filteredProviders = searchQuery.trim()
    ? rawProviders.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.full_name?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q)
        );
      })
    : rawProviders;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Shared Reusable UserTable */}
      <UserTable<Provider>
        items={filteredProviders}
        totalItems={data?.metadata?.total ?? rawProviders.length}
        currentPage={data?.metadata?.page ?? page}
        pageSize={data?.metadata?.page_size ?? PAGE_SIZE}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search providers..."
        emptyMessage="No providers found."
        onUserClick={handleViewDetails}
        renderStatus={(provider) => <ProviderStatusBadge status={provider.status} />}
        renderActions={(provider) => (
          <ProviderActions
            provider={provider}
            onOpenSuspendModal={handleOpenSuspendModal}
            onOpenReactivateModal={handleOpenReactivateModal}
            onOpenKycModal={handleOpenKycModal}
            onViewDetails={handleViewDetails}
          />
        )}
      />

      {/* Right-Side Provider Details Drawer */}
      <UserDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProviderId(null);
          setIsKycOpen(false);
          setSelectedKycProvider(null);
        }}
        userType="provider"
        userId={selectedProviderId}
        onOpenSuspendModal={handleOpenSuspendModal}
        onOpenReactivateModal={handleOpenReactivateModal}
        onOpenKycModal={handleOpenKycModal}
      />

      {/* Provider Verification / KYC Modal */}
      <ProviderKycModal
        isOpen={isKycOpen}
        provider={selectedKycProvider}
        onClose={() => {
          setIsKycOpen(false);
          setSelectedKycProvider(null);
        }}
        onSuccess={(msg) => showToast('success', msg)}
      />

      {/* Provider Action Confirmation Modal */}
      <ProviderConfirmModal
        isOpen={isModalOpen}
        actionType={modalAction}
        provider={selectedProvider}
        isLoading={isActionPending}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
