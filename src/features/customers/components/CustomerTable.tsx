import React from 'react';
import type { Customer } from '../customers.types';
import { CustomerStatusBadge } from './CustomerStatus';
import { CustomerActions } from './CustomerActions';
import { UserTable } from '../../../components/UserTable';

interface CustomerTableProps {
  customers: Customer[];
  totalCustomers: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSuspendModal: (customer: Customer) => void;
  onOpenReactivateModal: (customer: Customer) => void;
  onViewDetails?: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  totalCustomers,
  currentPage,
  pageSize,
  onPageChange,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  onSearchChange,
  onOpenSuspendModal,
  onOpenReactivateModal,
  onViewDetails,
}) => {
  return (
    <UserTable<Customer>
      items={customers}
      totalItems={totalCustomers}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={onPageChange}
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search customers..."
      emptyMessage="No customers found."
      onUserClick={onViewDetails}
      renderStatus={(customer) => <CustomerStatusBadge status={customer.status} />}
      renderActions={(customer) => (
        <CustomerActions
          customer={customer}
          onOpenSuspendModal={onOpenSuspendModal}
          onOpenReactivateModal={onOpenReactivateModal}
          onViewDetails={onViewDetails}
        />
      )}
    />
  );
};
