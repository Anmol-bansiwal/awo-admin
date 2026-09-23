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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs h-80 flex items-center justify-center animate-pulse">
        <div className="text-xs text-slate-400">Loading user growth data...</div>
      </div>
    );
  }

  const { summary, timeline } = report;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              User Growth & Acquisition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New registered customers and verified service providers over time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{summary.growthRate}% Growth</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase text-slate-400">Total Users</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {summary.totalUsers.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006E1C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#006E1C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorProviders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={{ stroke: '#CBD5E1' }}
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
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
            />
            <Area
              type="monotone"
              dataKey="customers"
              name="New Customers"
              stroke="#006E1C"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCustomers)"
            />
            <Area
              type="monotone"
              dataKey="providers"
              name="New Providers"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProviders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
