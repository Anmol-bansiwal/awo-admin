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
  if (!kycStatus) {
    return (
      <span className={`inline-flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium ${className}`}>
        —
      </span>
    );
  }

  const normalized = kycStatus.trim().toUpperCase();

  let variant: StatusBadgeVariant = 'warning';
  let label = 'KYC Pending';

  if (normalized === 'APPROVED' || normalized === 'VERIFIED') {
    variant = 'success';
    label = 'KYC Approved';
  } else if (normalized === 'REJECTED') {
    variant = 'danger';
    label = 'KYC Rejected';
  } else if (normalized === 'PENDING' || normalized === 'IN_REVIEW' || normalized === 'SUBMITTED') {
    variant = 'warning';
    label = 'KYC Pending';
  } else {
    variant = 'neutral';
    label = `KYC ${kycStatus}`;
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

