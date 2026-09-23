import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Calendar, CheckCircle2 } from 'lucide-react';
import type { BookingTrendsReport } from '../analytics.types';

interface BookingTrendsChartProps {
  report?: BookingTrendsReport;
  isLoading?: boolean;
}

export const BookingTrendsChart: React.FC<BookingTrendsChartProps> = ({ report, isLoading }) => {
  if (isLoading || !report) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs h-80 flex items-center justify-center animate-pulse">
        <div className="text-xs text-slate-400">Loading booking trends data...</div>
      </div>
    );
  }

  const { summary, timeline } = report;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Booking Activity & Volume
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completed, in-progress, and cancelled service mission trends
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{summary.completionRate}% Completion</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase text-slate-400">Total Volume</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {summary.totalBookings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <Bar dataKey="completed" name="Completed" fill="#006E1C" radius={[4, 4, 0, 0]} />
            <Bar dataKey="active" name="Active / In Progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelled" name="Cancelled" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
