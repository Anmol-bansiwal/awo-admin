import React from 'react';
import { RefreshCw } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';

interface CasePageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isFetching?: boolean;
  onRefresh: () => void;
}

export const CasePageHeader: React.FC<CasePageHeaderProps> = ({
  icon,
  title,
  subtitle,
  isFetching = false,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          {icon}
          <span>{title}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="self-start sm:self-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </button>
    </div>
  );
};

interface CaseFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  priorityFilter?: string;
  onPriorityChange?: (priority: string) => void;
  searchPlaceholder?: string;
  statusLabel?: string;
}

export const CaseFilterToolbar: React.FC<CaseFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  searchPlaceholder = 'Search cases...',
  statusLabel = 'All Statuses',
}) => {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between transition-colors">
      <div className="flex-1">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          size="sm"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
        {onPriorityChange && priorityFilter !== undefined && (
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        )}

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
        >
          <option value="all">{statusLabel}</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
          <option value="ESCALATED">Escalated</option>
        </select>
      </div>
    </div>
  );
};
