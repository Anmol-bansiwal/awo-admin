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

  const normalized = kycStatus.trim().toLowerCase();

  let variant: StatusBadgeVariant = 'neutral';
  let label = `KYC ${kycStatus}`;

  // Requirement: Show a "Needs review" badge when kyc_status is in_review or pending_admin_approval
  if (normalized === 'in_review' || normalized === 'pending_admin_approval') {
    variant = 'warning';
    label = 'Needs review';
  } else if (normalized === 'approved' || normalized === 'verified') {
    variant = 'success';
    label = 'KYC Approved';
  } else if (normalized === 'rejected') {
    variant = 'danger';
    label = 'KYC Rejected';
  } else if (normalized === 'declined') {
    variant = 'danger';
    label = 'KYC Declined';
  } else if (normalized === 'in_progress') {
    variant = 'neutral';
    label = 'In Progress';
  } else if (normalized === 'pending') {
    variant = 'neutral';
    label = 'Pending';
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
