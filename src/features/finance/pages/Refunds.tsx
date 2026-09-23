import React, { useState } from 'react';
import { RotateCcw, Search, RefreshCw } from 'lucide-react';
import { useRefundsQuery } from '../hooks/useRefunds';
import { RefundTable } from '../components/RefundTable';
import { RefundDetailsDrawer } from '../components/RefundDetailsDrawer';
import type { Refund } from '../finance.types';

export const Refunds: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected for Slide-over Drawer
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useRefundsQuery(page, 20, statusFilter, searchQuery);

  const refunds = response?.data || [];
  const total = response?.metadata?.total ?? refunds.length;

  const handleOpenDetails = (refund: Refund) => {
    setSelectedRefund(refund);
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
            <RotateCcw className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Refund Claims & Handling</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review customer refund requests, cancellation reimbursements, and refund audit history.
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
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between transition-colors">
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
            placeholder="Search by refund ID, customer name, booking ref, reason..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
          >
            <option value="all">All Refund Statuses</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
            <option value="under_review">Under Review</option>
            <option value="requested">Requested</option>
            <option value="processing">Processing</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <RefundTable
        refunds={refunds}
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
      <RefundDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDetails}
        refundId={selectedRefund?.id ?? null}
        initialRefund={selectedRefund}
      />
    </div>
  );
};
