import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { Customer } from '../customers.types';
import {
  useCustomerDetailsQuery,
  useSuspendCustomerMutation,
  useReactivateCustomerMutation,
} from '../hooks/useCustomers';
import { CustomerDetailsView } from '../components/CustomerDetailsView';
import { CustomerConfirmModal } from '../components/CustomerConfirmModal';
import { AwoLoader } from '../../../components/AwoLoader';

export const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalAction, setModalAction] = useState<'suspend' | 'reactivate'>('suspend');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: customer, isLoading, isError, error } = useCustomerDetailsQuery(id || '');
  const suspendMutation = useSuspendCustomerMutation();
  const reactivateMutation = useReactivateCustomerMutation();

  const handleOpenSuspendModal = (cust: Customer) => {
    setSelectedCustomer(cust);
    setModalAction('suspend');
    setIsModalOpen(true);
  };

  const handleOpenReactivateModal = (cust: Customer) => {
    setSelectedCustomer(cust);
    setModalAction('reactivate');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedCustomer) return;

    try {
      if (modalAction === 'suspend') {
        await suspendMutation.mutateAsync(selectedCustomer.id);
      } else {
        await reactivateMutation.mutateAsync(selectedCustomer.id);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed action:', err);
    }
  };

  const isActionPending = suspendMutation.isPending || reactivateMutation.isPending;

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <AwoLoader size="sm" message="Loading customer details..." />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <div>
          <h3 className="text-base font-bold text-slate-900">Customer Not Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {error?.message || 'The requested customer profile could not be retrieved from the server.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer List</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <CustomerDetailsView
        customer={customer}
        onOpenSuspendModal={handleOpenSuspendModal}
        onOpenReactivateModal={handleOpenReactivateModal}
      />

      <CustomerConfirmModal
        isOpen={isModalOpen}
        actionType={modalAction}
        customer={selectedCustomer}
        isLoading={isActionPending}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};
