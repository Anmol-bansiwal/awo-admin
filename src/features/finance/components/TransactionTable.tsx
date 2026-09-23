import React from 'react';
import { Eye, CreditCard } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import type { Transaction } from '../finance.types';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate, formatTransactionType } from '../utils/financeFormatters';

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (tx: Transaction) => void;
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

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onViewDetails,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  pagination,
}) => {
  const columns: ColumnDef<Transaction>[] = [
    {
      key: 'transaction_code',
      header: 'Transaction ID / Ref',
      render: (tx) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 dark:text-white font-mono block truncate group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 transition-colors">
              {tx.transaction_code || tx.reference_number || `#${tx.id.slice(0, 8)}`}
            </span>
            {tx.booking_code && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono block">
                Booking: {tx.booking_code}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (tx) => {
        const customerName =
          tx.customer?.full_name ||
          tx.customer?.name ||
          (tx.customer_id ? `Customer #${tx.customer_id.slice(0, 8)}` : '—');
        return (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block truncate">
              {customerName}
            </span>
            {tx.customer?.email && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                {tx.customer.email}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (tx) => (
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          {formatMoney(tx.amount, tx.currency)}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (tx) => (
        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] border border-slate-200/60 dark:border-slate-700">
          {formatTransactionType(tx.type)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx) => <FinanceStatus status={tx.status} />,
    },
    {
      key: 'created_at',
      header: 'Date',
      className: 'whitespace-nowrap text-slate-500 dark:text-slate-400',
      render: (tx) => formatFinanceDate(tx.created_at),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (tx) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(tx);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#006E1C] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <DataTable<Transaction>
      data={transactions}
      columns={columns}
      keyExtractor={(tx) => tx.id}
      onRowClick={onViewDetails}
      isLoading={isLoading}
      loadingMessage="Loading transactions..."
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle="No transactions found"
      emptyMessage="There are no transaction records matching your current criteria."
      emptyIcon={<CreditCard className="w-7 h-7" />}
      pagination={
        pagination
          ? {
            ...pagination,
            itemName: 'transactions',
          }
          : undefined
      }
    />
  );
};
