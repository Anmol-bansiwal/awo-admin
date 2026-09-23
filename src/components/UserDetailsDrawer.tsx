import React from 'react';
import { useCustomerDetailsQuery } from '../features/customers/hooks/useCustomers';
import { useProviderDetailsQuery } from '../features/providers/hooks/useProviders';
import { CustomerDetailsView } from '../features/customers/components/CustomerDetailsView';
import { ProviderDetailsView } from '../features/providers/components/ProviderDetailsView';
import { DetailsDrawer } from './DetailsDrawer';
import type { Customer } from '../features/customers/customers.types';
import type { Provider } from '../features/providers/providers.types';

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'customer' | 'provider';
  userId: string | null;
  onOpenSuspendModal?: (user: any) => void;
  onOpenReactivateModal?: (user: any) => void;
  onOpenKycModal?: (provider: Provider) => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  isOpen,
  onClose,
  userType,
  userId,
  onOpenSuspendModal,
  onOpenReactivateModal,
  onOpenKycModal,
}) => {
  const isCustomer = userType === 'customer';
  const activeUserId = isOpen && userId ? userId : '';

  const customerQuery = useCustomerDetailsQuery(isCustomer ? activeUserId : '');
  const providerQuery = useProviderDetailsQuery(!isCustomer ? activeUserId : '');

  const activeQuery = isCustomer ? customerQuery : providerQuery;
  const { data: userDetails, isLoading, isError, error } = activeQuery;

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={isCustomer ? 'Customer Details' : 'Provider Details'}
      subtitle={
        isCustomer
          ? 'View full customer profile and service locations.'
          : 'View provider profile, verification documents, and skills.'
      }
      maxWidthClassName="max-w-2xl"
      isLoading={isLoading}
      loadingMessage={`Loading ${isCustomer ? 'customer' : 'provider'} details...`}
      isError={isError || (!isLoading && !userDetails && Boolean(userId))}
      errorMessage={error?.message || `The requested ${userType} profile could not be retrieved from the server.`}
    >
      {userDetails && (
        <>
          {isCustomer ? (
            <CustomerDetailsView
              customer={userDetails as Customer}
              onOpenSuspendModal={(cust) => {
                onOpenSuspendModal?.(cust);
              }}
              onOpenReactivateModal={(cust) => {
                onOpenReactivateModal?.(cust);
              }}
              hideBackButton={true}
            />
          ) : (
            <ProviderDetailsView
              provider={userDetails as Provider}
              onOpenSuspendModal={(prov) => {
                onOpenSuspendModal?.(prov);
              }}
              onOpenReactivateModal={(prov) => {
                onOpenReactivateModal?.(prov);
              }}
              onOpenKycModal={onOpenKycModal}
              hideBackButton={true}
            />
          )}
        </>
      )}
    </DetailsDrawer>
  );
};
