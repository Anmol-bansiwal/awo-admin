import React from 'react';
import type { Provider } from '../providers.types';
import { ConfirmModal } from '../../../components/ConfirmModal';

interface ProviderConfirmModalProps {
  isOpen: boolean;
  actionType: 'suspend' | 'reactivate';
  provider: Provider | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProviderConfirmModal: React.FC<ProviderConfirmModalProps> = ({
  isOpen,
  actionType,
  provider,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  if (!provider) return null;

  const isSuspend = actionType === 'suspend';

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={isSuspend ? 'Suspend Provider Account?' : 'Reactivate Provider Account?'}
      variant={isSuspend ? 'danger' : 'success'}
      confirmText={isSuspend ? 'Suspend Provider' : 'Reactivate Provider'}
      isLoading={isLoading}
      onClose={onClose}
      onConfirm={onConfirm}
      description={
        isSuspend
          ? `Are you sure you want to suspend ${provider.full_name}'s account (${provider.email})? They will be unable to accept job requests or access services until reactivated.`
          : `Are you sure you want to reactivate ${provider.full_name}'s account (${provider.email})? Full provider account access will be restored.`
      }
    />
  );
};
