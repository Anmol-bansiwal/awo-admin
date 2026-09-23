import React from 'react';
import { Eye, ShieldCheck } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import type { EscrowRecord } from '../finance.types';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate } from '../utils/financeFormatters';

interface EscrowTableProps {
  records: EscrowRecord[];
  onViewDetails: (record: EscrowRecord) => void;
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

export const EscrowTable: React.FC<EscrowTableProps> = ({
  records,
  onViewDetails,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  pagination,
}) => {
  const columns: ColumnDef<EscrowRecord>[] = [
    {
      key: 'reference',
      header: 'Escrow Ref',
      render: (record) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/40">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white font-mono block truncate group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 transition-colors">
            {record.reference || `#${record.id.slice(0, 8)}`}
          </span>
        </div>
      ),
    },
    {
      key: 'booking_code',
      header: 'Booking',
      className: 'font-mono text-slate-700 dark:text-slate-300',
      render: (record) =>
        record.booking_code || (record.booking_id ? `#${record.booking_id.slice(0, 8)}` : '—'),
    },
    {
      key: 'customer',
      header: 'Customer',
      className: 'font-medium text-slate-800 dark:text-slate-200',
      render: (record) =>
        record.customer?.full_name ||
        record.customer?.name ||
        (record.customer_id ? `Customer #${record.customer_id.slice(0, 8)}` : '—'),
    },
    {
      key: 'provider',
      header: 'Provider',
      className: 'font-medium text-slate-800 dark:text-slate-200',
      render: (record) =>
        record.provider?.full_name ||
        record.provider?.name ||
        (record.provider_id ? `Provider #${record.provider_id.slice(0, 8)}` : '—'),
    },
    {
      key: 'amount',
      header: 'Held Amount',
      render: (record) => (
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          {formatMoney(record.amount, record.currency)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (record) => <FinanceStatus status={record.status} />,
    },
    {
      key: 'hold_date',
      header: 'Hold Date',
      className: 'whitespace-nowrap text-slate-500 dark:text-slate-400',
      render: (record) => formatFinanceDate(record.hold_date || record.created_at),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (record) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(record);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#006E1C] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
          title="View Escrow Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable<EscrowRecord>
      data={records}
      columns={columns}
      keyExtractor={(rec) => rec.id}
      onRowClick={onViewDetails}
      isLoading={isLoading}
      loadingMessage="Loading escrow records..."
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle="No escrow records found"
      emptyMessage="There are no escrow funds currently on record matching your filter criteria."
      emptyIcon={<ShieldCheck className="w-7 h-7 text-indigo-500" />}
      pagination={
        pagination
          ? {
              ...pagination,
              itemName: 'escrow records',
            }
          : undefined
      }
    />
  );
};
