import React from 'react';
import type { Customer } from '../customers.types';
import { ConfirmModal } from '../../../components/ConfirmModal';

interface CustomerConfirmModalProps {
  isOpen: boolean;
  actionType: 'suspend' | 'reactivate';
  customer: Customer | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CustomerConfirmModal: React.FC<CustomerConfirmModalProps> = ({
  isOpen,
  actionType,
  customer,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (!customer) return null;

  const isSuspend = actionType === 'suspend';

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={isSuspend ? 'Suspend Customer Account?' : 'Reactivate Customer Account?'}
      variant={isSuspend ? 'danger' : 'success'}
      confirmText={isSuspend ? 'Confirm Suspension' : 'Confirm Reactivation'}
      isLoading={isLoading}
      onClose={onClose}
      onConfirm={onConfirm}
      description={
        isSuspend
          ? `Are you sure you want to suspend ${customer.full_name}'s account (${customer.email})? They will be unable to access services until reactivated.`
          : `Are you sure you want to reactivate ${customer.full_name}'s account (${customer.email})? Their full account access will be restored.`
      }
    />
  );
};
