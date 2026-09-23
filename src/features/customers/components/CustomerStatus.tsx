import React from 'react';
import type { CustomerStatus as CustomerStatusType } from '../customers.types';
import { StatusBadge } from '../../../components/StatusBadge';

interface CustomerStatusProps {
  status: CustomerStatusType | string;
  className?: string;
}

export const CustomerStatusBadge: React.FC<CustomerStatusProps> = ({ status, className = '' }) => {
  const isApproved = (status || '').toString().toUpperCase() === 'ACTIVE';

  return (
    <StatusBadge
      label={isApproved ? 'ACTIVE' : 'SUSPENDED'}
      variant={isApproved ? 'success' : 'danger'}
      className={className}
    />
  );
};

