import React, { useState } from 'react';
import type { Customer } from '../customers.types';
import {
  useCustomersQuery,
  useSuspendCustomerMutation,
  useReactivateCustomerMutation,
} from '../hooks/useCustomers';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerConfirmModal } from '../components/CustomerConfirmModal';
import { UserDetailsDrawer } from '../../../components/UserDetailsDrawer';

const PAGE_SIZE = 20;

/**
 * Main customer management page.
 * - Displays paginated customers data table with real-time text search.
 * - Allows administrators to suspend or reactivate customer accounts.
 * - Opens customer details slide-over drawer.
 */
export const Customers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalAction, setModalAction] = useState<'suspend' | 'reactivate'>('suspend');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drawer State for viewing customer details on the same page
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data, isLoading, isError, error } = useCustomersQuery(page, PAGE_SIZE);
  const suspendMutation = useSuspendCustomerMutation();
  const reactivateMutation = useReactivateCustomerMutation();

  /**
   * Opens confirmation modal configured for account suspension.
   */
  const handleOpenSuspendModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalAction('suspend');
    setIsModalOpen(true);
  };

  /**
   * Opens confirmation modal configured for account reactivation.
   */
  const handleOpenReactivateModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalAction('reactivate');
    setIsModalOpen(true);
  };

  /**
   * Opens the slide-over details drawer for a specific customer.
   */
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setIsDrawerOpen(true);
  };

  /**
   * Submits the suspend or reactivate mutation to the backend.
   */
  const handleConfirmAction = async () => {
    if (!selectedCustomer) return;

    try {
      if (modalAction === 'suspend') {
        await suspendMutation.mutateAsync(selectedCustomer.id);
      } else {
        await reactivateMutation.mutateAsync(selectedCustomer.id);
      }
      setIsModalOpen(false);
      setSelectedCustomer(null);
    } catch (err: any) {
      console.error('Failed customer action:', err);
    }
  };

  const isActionPending = suspendMutation.isPending || reactivateMutation.isPending;

  // Raw customer list from real backend API
  const rawCustomers: Customer[] = data?.data || [];

  // Client-side search filtering across available fields
  const filteredCustomers = searchQuery.trim()
    ? rawCustomers.filter((c) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          c.full_name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q)
        );
      })
    : rawCustomers;

  return (
    <div className="space-y-6">
      {/* Customer Data Table */}
      <CustomerTable
        customers={filteredCustomers}
        totalCustomers={data?.metadata?.total ?? rawCustomers.length}
        currentPage={data?.metadata?.page ?? page}
        pageSize={data?.metadata?.page_size ?? PAGE_SIZE}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSuspendModal={handleOpenSuspendModal}
        onOpenReactivateModal={handleOpenReactivateModal}
        onViewDetails={handleViewDetails}
      />

      {/* Right-Side Details Drawer */}
      <UserDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCustomerId(null);
        }}
        userType="customer"
        userId={selectedCustomerId}
        onOpenSuspendModal={handleOpenSuspendModal}
        onOpenReactivateModal={handleOpenReactivateModal}
      />

      {/* Suspend / Reactivate Confirmation Modal */}
      <CustomerConfirmModal
        isOpen={isModalOpen}
        actionType={modalAction}
        customer={selectedCustomer}
        isLoading={isActionPending}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
