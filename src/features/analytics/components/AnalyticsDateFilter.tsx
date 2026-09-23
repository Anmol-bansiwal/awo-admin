import React from 'react';
import { Calendar } from 'lucide-react';
import type { AnalyticsDateRange } from '../analytics.types';

interface AnalyticsDateFilterProps {
  selectedRange: AnalyticsDateRange;
  onChange: (range: AnalyticsDateRange) => void;
}

const RANGES: { value: AnalyticsDateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '12m', label: 'Last 12 Months' },
];

export const AnalyticsDateFilter: React.FC<AnalyticsDateFilterProps> = ({
  selectedRange,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs">
      <div className="hidden sm:flex items-center px-2 text-slate-400 dark:text-slate-500">
        <Calendar className="w-3.5 h-3.5 mr-1" />
        <span className="text-[11px] font-semibold">Period:</span>
      </div>
      {RANGES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedRange === r.value
              ? 'bg-[#006E1C] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
};
