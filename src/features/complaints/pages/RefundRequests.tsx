import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  useRefundRequestsQuery,
  useApproveRefundMutation,
  useRejectRefundMutation,
} from '../hooks/useRefundRequests';
import { RefundRequestTable } from '../components/CaseTable';
import { CaseDetailsDrawer } from '../components/CaseDetailsDrawer';
import { CasePageHeader, CaseFilterToolbar } from '../components/CaseToolbar';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { formatMoney } from '../utils/complaintsFormatters';
import type { RefundRequestCase, ComplaintCase } from '../complaints.types';

export const RefundRequests: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefundRequest, setSelectedRefundRequest] = useState<RefundRequestCase | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    caseItem: ComplaintCase | null;
  }>({
    isOpen: false,
    type: 'approve',
    caseItem: null,
  });

  const { data: response, isLoading, isError, error, refetch, isFetching } = useRefundRequestsQuery(
    page,
    20,
    statusFilter,
    searchQuery
  );

  const approveMutation = useApproveRefundMutation();
  const rejectMutation = useRejectRefundMutation();

  const refundRequests = (response?.data as RefundRequestCase[]) || [];
  const total = response?.metadata?.total ?? refundRequests.length;

  const handleConfirmAction = async () => {
    const { type, caseItem } = confirmModal;
    if (!caseItem) return;

    if (type === 'approve') {
      await approveMutation.mutateAsync({
        id: caseItem.id,
        notes: `Refund of ${formatMoney(
          caseItem.requested_refund_amount ?? caseItem.disputed_amount,
          caseItem.currency
        )} approved by administrator.`,
      });
    } else {
      await rejectMutation.mutateAsync({
        id: caseItem.id,
        reason: 'Refund claim rejected after administrative review.',
      });
    }

    setConfirmModal({ isOpen: false, type: 'approve', caseItem: null });
    setSelectedRefundRequest(null);
  };

  return (
    <div className="space-y-6">
      <CasePageHeader
        icon={<RotateCcw className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
        title="Complaint Refund Requests"
        subtitle="Review customer reimbursement claims, cancellation disputes, and compensation requests."
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      <CaseFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(s) => { setStatusFilter(s); setPage(1); }}
        searchPlaceholder="Search by request ID, customer, booking, reason..."
        statusLabel="All Request Statuses"
      />

      <RefundRequestTable
        refundRequests={refundRequests}
        onViewDetails={setSelectedRefundRequest}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        pagination={{ currentPage: page, pageSize: 20, totalItems: total, onPageChange: setPage }}
      />

      <CaseDetailsDrawer
        isOpen={Boolean(selectedRefundRequest)}
        onClose={() => setSelectedRefundRequest(null)}
        caseItem={selectedRefundRequest}
        title="Refund Request Details"
        subtitle="Disputed charge & compensation review"
        onApproveRefund={(item) => setConfirmModal({ isOpen: true, type: 'approve', caseItem: item })}
        onRejectRefund={(item) => setConfirmModal({ isOpen: true, type: 'reject', caseItem: item })}
        isActionLoading={approveMutation.isPending || rejectMutation.isPending}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'approve', caseItem: null })}
        onConfirm={handleConfirmAction}
        isLoading={approveMutation.isPending || rejectMutation.isPending}
        title={confirmModal.type === 'approve' ? 'Approve Refund Claim?' : 'Reject Refund Claim?'}
        description={
          confirmModal.type === 'approve' ? (
            <p>
              Are you sure you want to approve the refund claim for{' '}
              <strong className="text-slate-900 dark:text-white">
                {confirmModal.caseItem?.customer?.full_name || confirmModal.caseItem?.customer?.name || 'this customer'}
              </strong>{' '}
              in the amount of{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {formatMoney(
                  confirmModal.caseItem?.requested_refund_amount ?? confirmModal.caseItem?.disputed_amount,
                  confirmModal.caseItem?.currency
                )}
              </strong>
              ? This will settle the case as resolved.
            </p>
          ) : (
            <p>
              Are you sure you want to reject the refund claim for{' '}
              <strong className="text-slate-900 dark:text-white">
                {confirmModal.caseItem?.case_number}
              </strong>
              ? This will mark the claim as rejected.
            </p>
          )
        }
        confirmText={confirmModal.type === 'approve' ? 'Yes, Approve Refund' : 'Yes, Reject Claim'}
        variant={confirmModal.type === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
};
