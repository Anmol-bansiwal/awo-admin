import React from 'react';
import { Clock, Eye, SlidersHorizontal, type LucideIcon } from 'lucide-react';

export interface PolicyCardProps {
  title: string;
  status?: string;
  description: string;
  updatedDate: string;
  icon: LucideIcon;
  onEdit: () => void;
  onViewLive: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  published:
    'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60',
};

const DEFAULT_STATUS_STYLES =
  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

export const PolicyCard: React.FC<PolicyCardProps> = ({
  title,
  status = 'Published',
  description,
  updatedDate,
  icon: Icon,
  onEdit,
  onViewLive,
}) => {
  const badgeStyles = STATUS_STYLES[status.toLowerCase()] ?? DEFAULT_STATUS_STYLES;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      {/* Top Section */}
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Icon className="w-5 h-5 text-[#38B449] shrink-0" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>

          <span
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeStyles}`}
          >
            {status}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Last updated: {updatedDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center space-x-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Edit Content</span>
        </button>

        <button
          type="button"
          onClick={onViewLive}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>View Live</span>
        </button>
      </div>
    </div>
  );
};