import React from 'react';
import { StatusBadge, type StatusBadgeVariant } from '../../../components/StatusBadge';
import type { CaseStatus, CasePriority } from '../complaints.types';
import { formatCaseStatus, formatCasePriority } from '../utils/complaintsFormatters';

const STATUS_CONFIG: Record<string, { variant: StatusBadgeVariant; pulseDot?: boolean }> = {
  OPEN: { variant: 'info' },
  UNDER_REVIEW: { variant: 'warning', pulseDot: true },
  RESOLVED: { variant: 'success' },
  REJECTED: { variant: 'neutral' },
  ESCALATED: { variant: 'danger', pulseDot: true },
};

const PRIORITY_VARIANT_MAP: Record<string, StatusBadgeVariant> = {
  LOW: 'neutral',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'danger',
};

interface ComplaintStatusProps {
  status?: CaseStatus | string | null;
  size?: 'sm' | 'md';
}

export const ComplaintStatus: React.FC<ComplaintStatusProps> = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[(status || '').toUpperCase()] || { variant: 'neutral' };

  return (
    <StatusBadge
      label={formatCaseStatus(status as CaseStatus)}
      variant={config.variant}
      dot
      pulseDot={config.pulseDot}
      shape="pill"
      size={size}
      uppercase={false}
    />
  );
};

interface CasePriorityBadgeProps {
  priority?: CasePriority | string | null;
  size?: 'sm' | 'md';
}

export const CasePriorityBadge: React.FC<CasePriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const variant = PRIORITY_VARIANT_MAP[(priority || '').toUpperCase()] || 'info';

  return (
    <StatusBadge
      label={formatCasePriority(priority as CasePriority)}
      variant={variant}
      shape="rounded"
      size={size}
      uppercase={false}
    />
  );
};
