import React, { useState } from 'react';
import { CreditCard, Search, RefreshCw } from 'lucide-react';
import { useTransactionsQuery } from '../hooks/useTransactions';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionDetailsDrawer } from '../components/TransactionDetailsDrawer';
import type { Transaction } from '../finance.types';

export const Transactions: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected for Slide-over Drawer
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTransactionsQuery(page, 20, statusFilter, searchQuery, typeFilter);

  const transactions = response?.data || [];
  const total = response?.metadata?.total ?? transactions.length;

  const handleOpenDetails = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-[#006E1C] dark:text-emerald-400" />
            <span>Financial Transactions</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time audit log of customer payments, escrow holds, disbursements, and refunds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between transition-colors">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by transaction ID, reference, customer name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
          />
        </div>

        {/* Status and Type Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="held_in_escrow">Held in Escrow</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
          >
            <option value="all">All Types</option>
            <option value="booking_payment">Booking Payment</option>
            <option value="payout">Payout</option>
            <option value="refund">Refund</option>
            <option value="commission">Commission</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <TransactionTable
        transactions={transactions}
        onViewDetails={handleOpenDetails}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        pagination={{
          currentPage: page,
          pageSize: 20,
          totalItems: total,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* SLIDE-OVER DETAIL DRAWER */}
      <TransactionDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDetails}
        transactionId={selectedTx?.id ?? null}
        initialTransaction={selectedTx}
      />
    </div>
  );
};
