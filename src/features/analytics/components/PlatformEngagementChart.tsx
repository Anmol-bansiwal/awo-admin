import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Activity, RotateCcw } from 'lucide-react';
import type { PlatformEngagementReport } from '../analytics.types';

interface PlatformEngagementChartProps {
  report?: PlatformEngagementReport;
  isLoading?: boolean;
}

export const PlatformEngagementChart: React.FC<PlatformEngagementChartProps> = ({
  report,
  isLoading,
}) => {
  if (isLoading || !report) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs h-80 flex items-center justify-center animate-pulse">
        <div className="text-xs text-slate-400">Loading platform engagement data...</div>
      </div>
    );
  }

  const { summary, timeline } = report;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800/40">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Platform Engagement & Retention
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active users, completed missions, and customer repeat bookings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{summary.repeatBookingRate}% Repeat Bookings</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase text-slate-400">Active Users</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {summary.monthlyActiveUsers.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <Line
              type="monotone"
              dataKey="activeUsers"
              name="Active Users"
              stroke="#006E1C"
              strokeWidth={3}
              dot={{ r: 3, fill: '#006E1C' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="completedMissions"
              name="Completed Missions"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="repeatBookings"
              name="Repeat Bookings"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
