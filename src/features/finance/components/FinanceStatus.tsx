import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import { StatusBadge, type StatusBadgeVariant } from '../../../components/StatusBadge';

interface FinanceStatusProps {
  status?: string | null;
  size?: 'sm' | 'md';
  className?: string;
}

export const FinanceStatus: React.FC<FinanceStatusProps> = ({
  status = 'pending',
  size = 'sm',
  className = '',
}) => {
  const normalized = (status || '').toLowerCase().trim();

  let variant: StatusBadgeVariant = 'warning';
  let label = status || 'Pending';
  let Icon = Clock;

  if (
    normalized === 'completed' ||
    normalized === 'paid' ||
    normalized === 'released' ||
    normalized === 'approved' ||
    normalized === 'success'
  ) {
    variant = 'success';
    label = status || 'Completed';
    Icon = CheckCircle2;
  } else if (
    normalized === 'failed' ||
    normalized === 'rejected' ||
    normalized === 'disputed'
  ) {
    variant = 'danger';
    label = status || 'Failed';
    Icon = AlertCircle;
  } else if (
    normalized === 'refunded' ||
    normalized === 'processing' ||
    normalized === 'requested' ||
    normalized === 'under_review'
  ) {
    variant = 'info';
    label = status || 'Processing';
    Icon = RotateCcw;
  } else if (
    normalized === 'held' ||
    normalized === 'held_in_escrow' ||
    normalized === 'pending_release'
  ) {
    variant = 'indigo';
    label = status === 'held' ? 'Held in Escrow' : (status || 'Escrow');
    Icon = ShieldCheck;
  } else if (normalized === 'payout') {
    variant = 'purple';
    label = status || 'Payout';
    Icon = ArrowUpRight;
  } else {
    variant = 'neutral';
    label = status || 'Unknown';
    Icon = HelpCircle;
  }

  return (
    <StatusBadge
      label={label.replace(/_/g, ' ')}
      variant={variant}
      icon={<Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      shape="rounded"
      size={size}
      uppercase={true}
      className={className}
    />
  );
};
