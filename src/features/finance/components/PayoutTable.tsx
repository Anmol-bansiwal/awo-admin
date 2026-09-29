import React from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import type { Payout } from '../finance.types';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate } from '../utils/financeFormatters';

interface PayoutTableProps {
  payouts: Payout[];
  onViewDetails: (payout: Payout) => void;
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

export const PayoutTable: React.FC<PayoutTableProps> = ({
  payouts,
  onViewDetails,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  pagination,
}) => {
  const columns: ColumnDef<Payout>[] = [
    {
      key: 'payout_code',
      header: 'Payout Code / ID',
      render: (payout) => (
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-800/40">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs text-slate-900 dark:text-white font-mono block truncate max-w-[120px] group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 transition-colors">
            {payout.payout_code || `#${payout.id.slice(0, 8)}`}
          </span>
        </div>
      ),
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (payout) => {
        const providerName =
          payout.provider?.full_name ||
          payout.provider?.name ||
          (payout.provider_id ? `Provider #${payout.provider_id.slice(0, 8)}` : '—');

        return (
          <div className="min-w-0 max-w-[130px]">
            <span className="font-semibold text-xs text-slate-900 dark:text-white block truncate">
              {providerName}
            </span>
            {payout.provider?.email && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                {payout.provider.email}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'whitespace-nowrap',
      render: (payout) => (
        <span className="font-bold text-slate-900 dark:text-white text-xs">
          {formatMoney(payout.amount, payout.currency)}
        </span>
      ),
    },
    {
      key: 'booking_code',
      header: 'Booking Ref',
      className: 'font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap',
      render: (payout) =>
        payout.booking_code || (payout.booking_id ? `#${payout.booking_id.slice(0, 8)}` : '—'),
    },
    {
      key: 'payout_method',
      header: 'Payout Method',
      className: 'text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap',
      render: (payout) => payout.payout_method || 'Bank Transfer',
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap',
      render: (payout) => <FinanceStatus status={payout.status} size="sm" />,
    },
    {
      key: 'date',
      header: 'Date',
      className: 'whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400',
      render: (payout) =>
        formatFinanceDate(payout.processed_at || payout.requested_at || payout.created_at),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (payout) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(payout);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-[#006E1C] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
          title="View Payout Details"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <DataTable<Payout>
      data={payouts}
      columns={columns}
      keyExtractor={(p) => p.id}
      onRowClick={onViewDetails}
      isLoading={isLoading}
      loadingMessage="Loading provider payouts..."
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle="No payouts found"
      emptyMessage="There are no payout records matching your search or filter criteria."
      emptyIcon={<ArrowUpRight className="w-7 h-7 text-purple-500" />}
      pagination={
        pagination
          ? {
              ...pagination,
              itemName: 'payouts',
            }
          : undefined
      }
    />
  );
};
