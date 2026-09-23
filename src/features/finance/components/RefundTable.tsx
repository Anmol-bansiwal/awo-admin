import React from 'react';
import { Eye, RotateCcw } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import type { Refund } from '../finance.types';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate } from '../utils/financeFormatters';

interface RefundTableProps {
  refunds: Refund[];
  onViewDetails: (refund: Refund) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}

export const RefundTable: React.FC<RefundTableProps> = ({
  refunds,
  onViewDetails,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  pagination,
}) => {
  const columns: ColumnDef<Refund>[] = [
    {
      key: 'refund_code',
      header: 'Refund ID',
      render: (refund) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/40">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white font-mono block truncate group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 transition-colors">
            {refund.refund_code || `#${refund.id.slice(0, 8)}`}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (refund) => {
        const customerName =
          refund.customer?.full_name ||
          refund.customer?.name ||
          (refund.customer_id ? `Customer #${refund.customer_id.slice(0, 8)}` : '—');

        return (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block truncate">
              {customerName}
            </span>
            {refund.customer?.email && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                {refund.customer.email}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (refund) => (
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          {formatMoney(refund.amount, refund.currency)}
        </span>
      ),
    },
    {
      key: 'booking_code',
      header: 'Booking Ref',
      className: 'font-mono text-slate-700 dark:text-slate-300',
      render: (refund) =>
        refund.booking_code || (refund.booking_id ? `#${refund.booking_id.slice(0, 8)}` : '—'),
    },
    {
      key: 'reason',
      header: 'Reason',
      className: 'max-w-xs truncate text-slate-600 dark:text-slate-400',
      render: (refund) => refund.reason || '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (refund) => <FinanceStatus status={refund.status} />,
    },
    {
      key: 'created_at',
      header: 'Date',
      className: 'whitespace-nowrap text-slate-500 dark:text-slate-400',
      render: (refund) => formatFinanceDate(refund.created_at),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (refund) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(refund);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#006E1C] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
          title="View Refund Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable<Refund>
      data={refunds}
      columns={columns}
      keyExtractor={(r) => r.id}
      onRowClick={onViewDetails}
      isLoading={isLoading}
      loadingMessage="Loading refund claims..."
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle="No refund records found"
      emptyMessage="There are no refund claims matching your search or filter criteria."
      emptyIcon={<RotateCcw className="w-7 h-7 text-blue-500" />}
      pagination={
        pagination
          ? {
              ...pagination,
              itemName: 'refund claims',
            }
          : undefined
      }
    />
  );
};
