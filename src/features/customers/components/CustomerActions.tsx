import React from 'react';
import { Eye, Ban, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '../customers.types';
import { ActionMenu } from '../../../components/ActionMenu';

interface CustomerActionsProps {
  customer: Customer;
  onOpenSuspendModal: (customer: Customer) => void;
  onOpenReactivateModal: (customer: Customer) => void;
  onViewDetails?: (customer: Customer) => void;
}

export const CustomerActions: React.FC<CustomerActionsProps> = ({
  customer,
  onOpenSuspendModal,
  onOpenReactivateModal,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const isActive = (customer.status || '').toString().toUpperCase() === 'ACTIVE';

  return (
    <ActionMenu
      items={[
        [
          {
            key: 'view_details',
            label: 'View Customer Details',
            icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
            onClick: () => {
              if (onViewDetails) {
                onViewDetails(customer);
              } else {
                navigate(`/customers/${customer.id}`);
              }
            },
          },
        ],
        [
          isActive
            ? {
                key: 'suspend',
                label: 'Suspend Account',
                icon: <Ban className="w-3.5 h-3.5 text-rose-500" />,
                variant: 'danger',
                onClick: () => onOpenSuspendModal(customer),
              }
            : {
                key: 'reactivate',
                label: 'Reactivate Account',
                icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#006E1C]" />,
                variant: 'success',
                onClick: () => onOpenReactivateModal(customer),
              },
        ],
      ]}
    />
  );
};
