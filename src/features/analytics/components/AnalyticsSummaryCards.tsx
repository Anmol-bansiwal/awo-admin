import React from 'react';
import { Users, Calendar, Banknote, UserCheck, Activity, TrendingUp, TrendingDown } from 'lucide-react';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs animate-pulse space-y-3"
          >
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-7 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      metric: overview.totalUsers,
      icon: Users,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      metric: overview.totalBookings,
      icon: Calendar,
      iconBg: 'bg-blue-50 dark:bg-blue-950/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      metric: overview.grossRevenue,
      icon: Banknote,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      metric: overview.activeProviders,
      icon: UserCheck,
      iconBg: 'bg-purple-50 dark:bg-purple-950/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      metric: overview.engagementRate,
      icon: Activity,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {c.metric.title}
                </span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {c.metric.value}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${c.iconBg} ${c.iconColor} shrink-0`}>
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                {c.metric.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span>+{c.metric.changePercentage}%</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate">
                {c.metric.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
