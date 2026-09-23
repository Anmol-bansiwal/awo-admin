import React, { useState } from 'react';
import { BarChart3, RefreshCw, Calendar } from 'lucide-react';
import { useRevenueReportsQuery } from '../hooks/useRevenueReports';
import { RevenueReportTable } from '../components/RevenueReportTable';
import { formatMoney } from '../utils/financeFormatters';

export const RevenueReports: React.FC = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const { data: report, isLoading, isError, error, refetch, isFetching } = useRevenueReportsQuery(period);

  const periods = report?.periods || [];
  const summary = report?.summary;

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#006E1C] dark:text-emerald-400" />
            <span>Platform Revenue Reports</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Financial reporting analytics, gross service values, commission earnings, and payouts.
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

      {/* SUMMARY STATS (Only displayed when provided by API per spec rule 20) */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Revenue
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatMoney(summary.total_revenue, summary.currency)}
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Commission Earned
            </div>
            <div className="text-2xl font-extrabold text-[#006E1C] dark:text-emerald-400">
              {formatMoney(summary.total_commission, summary.currency)}
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Provider Disbursements
            </div>
            <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-400">
              {formatMoney(summary.total_payouts, summary.currency)}
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Refunds Issued
            </div>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {formatMoney(summary.total_refunds, summary.currency)}
            </div>
          </div>
        </div>
      )}

      {/* REPORT PERIOD FILTER TOOLBAR */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Aggregation Granularity:</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                period === p
                  ? 'bg-white dark:bg-slate-900 text-[#006E1C] dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <RevenueReportTable
        periods={periods}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    </div>
  );
};
