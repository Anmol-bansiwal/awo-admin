import React, { useState, useMemo } from 'react';
import { UserCheck } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import { StatusBadge } from '../../../components/StatusBadge';
import { SearchBar } from '../../../components/SearchBar';
import { formatCurrency } from '../../../utils/formatters';
import type { ProviderPerformanceReport, ProviderPerformanceItem } from '../analytics.types';

interface ProviderPerformanceTableProps {
  report?: ProviderPerformanceReport;
  isLoading?: boolean;
}

export const ProviderPerformanceTable: React.FC<ProviderPerformanceTableProps> = ({
  report,
  isLoading,
}) => {
  const [search, setSearch] = useState('');

  const providers = report?.providers || [];

  const filteredProviders = useMemo(() => {
    if (!search.trim()) return providers;
    const q = search.toLowerCase().trim();
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [providers, search]);

  const columns: ColumnDef<ProviderPerformanceItem>[] = [
    {
      key: 'name',
      header: 'Provider',
      render: (p) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-100 dark:border-emerald-800/40">
            {p.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-900 dark:text-white text-xs truncate">
              {p.name}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{p.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Primary Category',
      render: (p) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{p.category}</span>
      ),
    },
    {
      key: 'totalBookings',
      header: 'Total Missions',
      align: 'center',
      render: (p) => (
        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
          {p.totalBookings}
        </span>
      ),
    },
    {
      key: 'completionRate',
      header: 'Completion Rate',
      align: 'center',
      render: (p) => (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#006E1C] rounded-full"
              style={{ width: `${Math.min(100, p.completionRate)}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
            {p.completionRate}%
          </span>
        </div>
      ),
    },
    {
      key: 'grossRevenue',
      header: 'Gross Earnings',
      align: 'right',
      render: (p) => (
        <span className="font-semibold text-slate-900 dark:text-white text-xs font-mono">
          {formatCurrency(p.grossRevenue, 'EUR')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (p) => (
        <StatusBadge
          label={p.status}
          variant={p.status === 'active' ? 'success' : 'neutral'}
          dot
          size="sm"
        />
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden space-y-4 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-800/40">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Provider Performance Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Job completions, fulfillment reliability, and service volume
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search provider or trade..."
            size="sm"
          />
        </div>
      </div>

      <DataTable<ProviderPerformanceItem>
        data={filteredProviders}
        columns={columns}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        loadingMessage="Loading provider performance records..."
        emptyTitle="No providers found"
        emptyMessage={
          search
            ? `No provider records matched "${search}".`
            : 'No provider performance metrics available.'
        }
      />
    </div>
  );
};
