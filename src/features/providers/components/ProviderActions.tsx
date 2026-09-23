import React from 'react';
import { Eye, CheckCircle2, Ban, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Provider } from '../providers.types';
import { ActionMenu } from '../../../components/ActionMenu';

interface ProviderActionsProps {
  provider: Provider;
  onOpenSuspendModal: (provider: Provider) => void;
  onOpenReactivateModal: (provider: Provider) => void;
  onOpenKycModal?: (provider: Provider) => void;
  onViewDetails?: (provider: Provider) => void;
}

export const ProviderActions: React.FC<ProviderActionsProps> = ({
  provider,
  onOpenSuspendModal,
  onOpenReactivateModal,
  onOpenKycModal,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const isApproved = (provider.status || '').toString().toUpperCase() === 'ACTIVE';

  return (
    <ActionMenu
      title="More Provider Actions"
      items={[
        [
          {
            key: 'view_details',
            label: 'View Provider Details',
            icon: <Eye className="w-3.5 h-3.5 text-slate-400" />,
            onClick: () => {
              if (onViewDetails) {
                onViewDetails(provider);
              } else {
                navigate(`/providers/${provider.id}`);
              }
            },
          },
          ...(onOpenKycModal
            ? [
                {
                  key: 'check_kyc',
                  label: 'Verify KYC Documents',
                  icon: <FileCheck className="w-3.5 h-3.5 text-[#006E1C]" />,
                  onClick: () => onOpenKycModal(provider),
                },
              ]
            : []),
        ],
        [
          isApproved
            ? {
                key: 'suspend',
                label: 'Suspend Provider',
                icon: <Ban className="w-3.5 h-3.5 text-rose-500" />,
                variant: 'danger' as const,
                onClick: () => onOpenSuspendModal(provider),
              }
            : {
                key: 'reactivate',
                label: 'Reactivate Provider',
                icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#006E1C]" />,
                variant: 'success' as const,
                onClick: () => onOpenReactivateModal(provider),
              },
        ],
      ]}
    />
  );
};
