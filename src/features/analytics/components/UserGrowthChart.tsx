import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Users, TrendingUp } from 'lucide-react';
import type { UserGrowthReport } from '../analytics.types';

interface UserGrowthChartProps {
  report?: UserGrowthReport;
  isLoading?: boolean;
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ report, isLoading }) => {
  if (isLoading || !report) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs h-84 flex flex-col justify-between animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-56 bg-slate-100 dark:bg-slate-850 rounded" />
          </div>
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-52 w-full bg-slate-100/60 dark:bg-slate-800/40 rounded-xl flex items-center justify-center text-xs text-slate-400">
          Loading user growth data...
        </div>
      </div>
    );
  }

  const { summary, timeline } = report;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40 shadow-2xs">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              User Growth & Acquisition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              New customer and verified provider registrations over time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 font-bold">
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+{summary.growthRate}% Growth</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {summary.totalUsers.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="h-68 sm:h-74 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006E1C" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#006E1C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorProviders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                color: '#fff',
                fontSize: '12px',
                padding: '10px 14px',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#F8FAFC', marginBottom: '6px' }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="customers"
              name="New Customers"
              stroke="#006E1C"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCustomers)"
            />
            <Area
              type="monotone"
              dataKey="providers"
              name="New Providers"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorProviders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
