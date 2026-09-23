import React from 'react';
import type { ProviderStatus as ProviderStatusType } from '../providers.types';
import { StatusBadge, type StatusBadgeVariant } from '../../../components/StatusBadge';

interface ProviderStatusProps {
  status: ProviderStatusType | string;
  className?: string;
}

export const ProviderStatusBadge: React.FC<ProviderStatusProps> = ({ status, className = '' }) => {
  const upper = (status || '').toString().toUpperCase();
  const isApproved = upper === 'ACTIVE';
  const isPending = upper === 'PENDING';

  const variant: StatusBadgeVariant = isApproved
    ? 'success'
    : isPending
      ? 'warning'
      : 'danger';

  return (
    <StatusBadge
      label={status}
      variant={variant}
      className={className}
    />
  );
};

export const ProviderKycStatusBadge: React.FC<{
  kycStatus?: string | null;
  className?: string;
}> = ({ kycStatus, className = '' }) => {
  const status = (kycStatus || 'pending').toUpperCase();

  let variant: StatusBadgeVariant = 'warning';
  let label = 'KYC Pending';

  if (status === 'APPROVED') {
    variant = 'success';
    label = 'KYC Approved';
  } else if (status === 'REJECTED') {
    variant = 'danger';
    label = 'KYC Rejected';
  }

  return (
    <StatusBadge
      label={label}
      variant={variant}
      dot={true}
      shape="pill"
      uppercase={false}
      className={className}
    />
  );
};

