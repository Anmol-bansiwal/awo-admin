import React from 'react';
import {
  Users,
  Calendar,
  Banknote,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type { AnalyticsOverview } from '../analytics.types';

interface AnalyticsSummaryCardsProps {
  overview?: AnalyticsOverview;
  isLoading?: boolean;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  overview,
  isLoading,
}) => {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-28 bg-slate-100 dark:bg-slate-850 rounded pt-2" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      metric: overview.totalUsers,
      icon: Users,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      iconBorder: 'border-emerald-100 dark:border-emerald-900/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      metric: overview.totalBookings,
      icon: Calendar,
      iconBg: 'bg-blue-50 dark:bg-blue-950/50',
      iconBorder: 'border-blue-100 dark:border-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      metric: overview.grossRevenue,
      icon: Banknote,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      iconBorder: 'border-emerald-100 dark:border-emerald-900/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      metric: overview.activeProviders,
      icon: UserCheck,
      iconBg: 'bg-purple-50 dark:bg-purple-950/50',
      iconBorder: 'border-purple-100 dark:border-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      metric: overview.engagementRate,
      icon: Activity,
      iconBg: 'bg-amber-50 dark:bg-amber-950/50',
      iconBorder: 'border-amber-100 dark:border-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        const change = c.metric.changePercentage ?? 0;
        const hasChange = typeof change === 'number' && change !== 0;

        return (
          <div
            key={idx}
            className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Header row: Title and Icon */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter truncate"
                  title={c.metric.title}
                >
                  {c.metric.title}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg sm:rounded-xl ${c.iconBg} ${c.iconColor} border ${c.iconBorder} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
              </div>

              {/* Metric Value: Full width underneath */}
              <div
                className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate"
                title={c.metric.value}
              >
                {c.metric.value}
              </div>
            </div>

            {/* Footer row: Trend and Subtitle */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs gap-1.5 min-w-0">
              {hasChange ? (
                <div
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[11px] shrink-0 ${
                    c.metric.isPositive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {c.metric.isPositive ? (
                    <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                  )}
                  <span>
                    {c.metric.isPositive ? '+' : ''}
                    {change}%
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                  <Minus className="w-3 h-3" />
                  <span>Real-time</span>
                </div>
              )}

              {c.metric.subtitle && (
                <span
                  className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate text-right min-w-0"
                  title={c.metric.subtitle}
                >
                  {c.metric.subtitle}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
