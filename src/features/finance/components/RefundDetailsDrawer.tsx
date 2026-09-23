import React from 'react';
import { RotateCcw, Calendar, User, Tag, FileText } from 'lucide-react';
import { DetailsDrawer } from '../../../components/DetailsDrawer';
import { useRefundDetailsQuery } from '../hooks/useRefunds';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate } from '../utils/financeFormatters';
import type { Refund } from '../finance.types';

interface RefundDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  refundId: string | null;
  initialRefund?: Refund | null;
}

export const RefundDetailsDrawer: React.FC<RefundDetailsDrawerProps> = ({
  isOpen,
  onClose,
  refundId,
  initialRefund,
}) => {
  const activeId = isOpen && refundId ? refundId : '';
  const { data: apiRefund, isLoading, isError, error } = useRefundDetailsQuery(activeId);

  const refund = apiRefund || initialRefund;

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Refund Request Details"
      subtitle="Customer reimbursement claim & audit record"
      icon={
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/40 shrink-0">
          <RotateCcw className="w-5 h-5" />
        </div>
      }
      maxWidthClassName="max-w-xl"
      isLoading={isLoading && !refund}
      loadingMessage="Loading refund details..."
      isError={!isLoading && isError && !refund}
      errorMessage={error instanceof Error ? error.message : 'Failed to load refund details.'}
      showDefaultFooter
    >
      {refund && (
        <div className="space-y-6">
          {/* Top Amount Hero */}
          <DetailsDrawer.Hero
            subtitle="Refund Amount"
            title={formatMoney(refund.amount, refund.currency)}
            badge={<FinanceStatus status={refund.status} size="md" />}
          />

          {/* Refund Breakdown */}
          <DetailsDrawer.Section title="Refund Breakdown">
            <DetailsDrawer.Row
              icon={<Tag className="w-4 h-4" />}
              label="Refund ID"
              value={refund.refund_code || refund.id}
              mono
            />

            {(refund.customer || refund.customer_id) && (
              <DetailsDrawer.Row
                icon={<User className="w-4 h-4" />}
                label="Claimant Customer"
                value={refund.customer?.full_name || refund.customer?.name || `Customer #${refund.customer_id?.slice(0, 8)}`}
                subvalue={refund.customer?.email}
              />
            )}

            {(refund.booking_code || refund.booking_id) && (
              <DetailsDrawer.Row
                icon={<Calendar className="w-4 h-4" />}
                label="Associated Booking"
                value={refund.booking_code || `#${refund.booking_id?.slice(0, 8)}`}
                mono
              />
            )}

            <DetailsDrawer.Row
              icon={<Calendar className="w-4 h-4" />}
              label="Requested Timestamp"
              value={formatFinanceDate(refund.requested_at || refund.created_at)}
            />
          </DetailsDrawer.Section>

          {/* Reason & Notes */}
          {(refund.reason || refund.admin_notes) && (
            <DetailsDrawer.Section title="Claim & Review Details">
              {refund.reason && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Customer Claim Reason</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {refund.reason}
                  </p>
                </div>
              )}

              {refund.admin_notes && (
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Admin Review Notes</span>
                  </div>
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    {refund.admin_notes}
                  </p>
                </div>
              )}
            </DetailsDrawer.Section>
          )}
        </div>
      )}
    </DetailsDrawer>
  );
};

