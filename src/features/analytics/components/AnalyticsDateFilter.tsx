import React from 'react';
import { Calendar } from 'lucide-react';
import type { AnalyticsDateRange } from '../analytics.types';

interface AnalyticsDateFilterProps {
  selectedRange: AnalyticsDateRange;
  onChange: (range: AnalyticsDateRange) => void;
}

const RANGES: { value: AnalyticsDateRange; label: string; shortLabel: string }[] = [
  { value: '7d', label: 'Last 7 Days', shortLabel: '7D' },
  { value: '30d', label: 'Last 30 Days', shortLabel: '30D' },
  { value: '90d', label: 'Last 90 Days', shortLabel: '90D' },
  { value: '12m', label: 'Last 12 Months', shortLabel: '12M' },
];

export const AnalyticsDateFilter: React.FC<AnalyticsDateFilterProps> = ({
  selectedRange,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl shadow-2xs">
      <div className="hidden sm:flex items-center pl-2.5 pr-1.5 text-slate-500 dark:text-slate-400">
        <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#006E1C] dark:text-emerald-400" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Period:</span>
      </div>
      {RANGES.map((r) => {
        const isSelected = selectedRange === r.value;
        return (
          <button
            key={r.value}
            type="button"
            onClick={() => onChange(r.value)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-white dark:bg-slate-900 text-[#006E1C] dark:text-emerald-400 shadow-xs ring-1 ring-slate-200/70 dark:ring-slate-700/80 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <span className="hidden sm:inline">{r.label}</span>
            <span className="sm:hidden">{r.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
