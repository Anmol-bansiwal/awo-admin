import React, { useState } from 'react';
import { ShieldCheck, Search, RefreshCw, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { useEscrowQuery, useEscrowSummaryQuery } from '../hooks/useEscrow';
import { EscrowTable } from '../components/EscrowTable';
import { EscrowDetailsDrawer } from '../components/EscrowDetailsDrawer';
import { formatMoney } from '../utils/financeFormatters';
import type { EscrowRecord } from '../finance.types';

export const Escrow: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected for Slide-over Drawer
  const [selectedRecord, setSelectedRecord] = useState<EscrowRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEscrowQuery(page, 20, statusFilter, searchQuery);

  const { data: summaryData } = useEscrowSummaryQuery();

  const records = response?.data || [];
  const summary = summaryData || response?.summary;
  const total = response?.metadata?.total ?? records.length;

  const handleOpenDetails = (record: EscrowRecord) => {
    setSelectedRecord(record);
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
            <ShieldCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Escrow Vault Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track customer payments locked in escrow during active bookings until mission completion and release.
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

      {/* SUMMARY STATS (Only displayed when provided by API per spec rule 9) */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.total_escrow !== undefined && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Total Escrow</span>
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatMoney(summary.total_escrow, summary.currency)}
              </div>
            </div>
          )}

          {summary.pending_release !== undefined && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Pending Release</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatMoney(summary.pending_release, summary.currency)}
              </div>
            </div>
          )}

          {summary.released !== undefined && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Released Funds</span>
                <CheckCircle2 className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatMoney(summary.released, summary.currency)}
              </div>
            </div>
          )}

          {summary.refunded !== undefined && (
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Refunded</span>
                <RotateCcw className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatMoney(summary.refunded, summary.currency)}
              </div>
            </div>
          )}
        </div>
      )}

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
            placeholder="Search by escrow ID, booking ref, customer, provider..."
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
            <option value="all">All Escrow Statuses</option>
            <option value="held">Held in Vault</option>
            <option value="pending_release">Pending Release</option>
            <option value="released">Released to Provider</option>
            <option value="refunded">Refunded to Customer</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <EscrowTable
        records={records}
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
      <EscrowDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDetails}
        record={selectedRecord}
      />
    </div>
  );
};
