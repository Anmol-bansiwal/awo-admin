import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  ClipboardList,
  Calendar,
  CheckCircle,
  Banknote,
  Wallet,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { useCustomersQuery, CUSTOMERS_QUERY_KEY } from '../features/customers/hooks/useCustomers';
import { useProvidersQuery, PROVIDERS_QUERY_KEY } from '../features/providers/hooks/useProviders';
import { useBookingsQuery, BOOKINGS_QUERY_KEY } from '../features/bookings/hooks/useBookings';
import { useBookingTrendsQuery, ANALYTICS_QUERY_KEYS } from '../features/analytics/hooks/useAnalytics';
import type { AnalyticsDateRange } from '../features/analytics/analytics.types';
import type { Booking } from '../features/bookings/bookings.types';
import { BookingStatus } from '../features/bookings/components/BookingStatus';
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

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  isPositive?: boolean;
  isWarning?: boolean;
  isLive?: boolean;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

/**
 * Metric summary card rendering key operational statistics with optional live pulsing badge.
 */
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  isPositive,
  isWarning,
  isLive,
  icon: Icon,
  iconBgColor,
  iconColor,
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider font-inter text-slate-500 dark:text-slate-400">
            {title}
          </span>
          {isLive && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
              title="Live Backend Data"
            />
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
      </div>
      <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor} shrink-0`}>
        <Icon className="w-5 h-5 stroke-[2]" />
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold">
      {isPositive && (
        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          {subtitle}
        </span>
      )}
      {isWarning && (
        <span className="text-rose-600 dark:text-rose-400 font-semibold">{subtitle}</span>
      )}
      {!isPositive && !isWarning && (
        <span className="text-slate-500 dark:text-slate-400 font-medium">{subtitle}</span>
      )}
    </div>
  </div>
);

/**
 * Main administrator dashboard page.
 * - Displays high-level platform KPI metrics (Total Users, Total Providers, Pending KYC).
 * - Live-connects to backend APIs for customer and provider counts.
 * - Provides quick navigation cards and simulated financial overviews.
 */
export const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Live backend data hooks (real endpoints on server)
  const customersQuery = useCustomersQuery(1, 1);
  const providersQuery = useProvidersQuery(1, 1);
  const pendingKycQuery = useProvidersQuery(1, 1, 'pending');
  const activeBookingsQuery = useBookingsQuery(1, 1, 'PENDING');
  const completedBookingsQuery = useBookingsQuery(1, 1, 'COMPLETED');
  const rejectedBookingsQuery = useBookingsQuery(1, 1, 'REJECTED');

  const mapRangeToKey = (label: string): AnalyticsDateRange => {
    if (label === 'Last 7 Days') return '7d';
    if (label === 'This Year') return '12m';
    return '30d';
  };

  const currentRangeKey = mapRangeToKey(timeRange);
  const bookingTrendsQuery = useBookingTrendsQuery(currentRangeKey);
  const recentBookingsQuery = useBookingsQuery(1, 6);
  const recentBookings: Booking[] = Array.isArray(recentBookingsQuery.data?.data)
    ? recentBookingsQuery.data.data
    : [];

  /**
   * Refetches live backend query data and simulates refresh spinner.
   * 
   * @param newRange - Optional newly selected date range string.
   */
  const handleRefreshData = async (newRange?: string) => {
    setIsRefreshing(true);
    if (newRange) {
      setTimeRange(newRange);
    }
    const rangeKey = mapRangeToKey(newRange || timeRange);
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.bookingTrends(rangeKey) }),
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Dynamic values from live backend APIs
  const liveTotalUsers =
    customersQuery.data?.metadata?.total !== undefined
      ? customersQuery.data.metadata.total.toLocaleString()
      : customersQuery.isLoading
      ? '...'
      : '0';

  const liveTotalProviders =
    providersQuery.data?.metadata?.total !== undefined
      ? providersQuery.data.metadata.total.toLocaleString()
      : providersQuery.isLoading
      ? '...'
      : '0';

  const livePendingKyc =
    pendingKycQuery.data?.metadata?.total !== undefined
      ? pendingKycQuery.data.metadata.total.toLocaleString()
      : pendingKycQuery.isLoading
      ? '...'
      : '0';

  const liveActiveBookings =
    activeBookingsQuery.data?.metadata?.total !== undefined
      ? activeBookingsQuery.data.metadata.total.toLocaleString()
      : activeBookingsQuery.isLoading
      ? '...'
      : '0';

  const liveCompletedBookings =
    completedBookingsQuery.data?.metadata?.total !== undefined
      ? completedBookingsQuery.data.metadata.total.toLocaleString()
      : completedBookingsQuery.isLoading
      ? '...'
      : '0';

  const liveRejectedBookings =
    rejectedBookingsQuery.data?.metadata?.total !== undefined
      ? rejectedBookingsQuery.data.metadata.total.toLocaleString()
      : rejectedBookingsQuery.isLoading
      ? '...'
      : '0';

  // Metrics: Live for Customers, Providers, Pending KYC & Bookings; static for unbacked metrics
  const metrics: MetricCardProps[] = [
    {
      title: 'TOTAL USERS',
      value: liveTotalUsers,
      subtitle: 'Live registered customers',
      isPositive: true,
      isLive: true,
      icon: Users,
      iconBgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      title: 'TOTAL PROVIDERS',
      value: liveTotalProviders,
      subtitle: 'Live verified experts',
      isLive: true,
      icon: UserCheck,
      iconBgColor: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-700 dark:text-slate-300',
    },
    {
      title: 'PENDING KYC',
      value: livePendingKyc,
      subtitle: 'Awaiting review',
      isLive: true,
      icon: ClipboardList,
      iconBgColor: 'bg-rose-50 dark:bg-rose-950/40',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'ACTIVE BOOKINGS',
      value: liveActiveBookings,
      subtitle: 'In progress today',
      isLive: true,
      icon: Calendar,
      iconBgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      title: 'COMPLETED BOOKINGS',
      value: liveCompletedBookings,
      subtitle: 'All time',
      isLive: true,
      icon: CheckCircle,
      iconBgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      title: 'REVENUE',
      value: '€45,230',
      subtitle: 'This month',
      icon: Banknote,
      iconBgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      title: 'IN ESCROW',
      value: '€12,540',
      subtitle: 'Secured funds',
      icon: Wallet,
      iconBgColor: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-700 dark:text-slate-300',
    },
    {
      title: 'REJECTED BOOKINGS',
      value: liveRejectedBookings,
      subtitle: 'Cancelled or declined',
      isWarning: true,
      isLive: true,
      icon: AlertTriangle,
      iconBgColor: 'bg-rose-50 dark:bg-rose-950/40',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  const trendsData = bookingTrendsQuery.data;
  const timelineData = trendsData?.timeline || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      {/* Refresh Metrics Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Platform Overview
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleRefreshData()}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#006E1C] dark:text-emerald-400 
              ${isRefreshing ? 'animate-spin' : ''
            }`}
          />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* METRICS GRID: 8 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* LOWER SECTION: BOOKING TRENDS & RECENT BOOKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BOOKING TRENDS CHART CARD (2 COLS) - DYNAMIC VISUALIZATION */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Booking Trends
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Backend Data" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Activity volume breakdown by status
              </p>
            </div>

            <div className="flex items-center gap-3">
              {trendsData?.summary && (
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
                    {trendsData.summary.completionRate}% Done
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    <strong className="text-slate-900 dark:text-white font-extrabold">{trendsData.summary.totalBookings.toLocaleString()}</strong> Total
                  </span>
                </div>
              )}

              {/* Time Range Selector */}
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => {
                    const options = ['Last 7 Days', 'Last 30 Days', 'This Year'];
                    const nextIndex = (options.indexOf(timeRange) + 1) % options.length;
                    handleRefreshData(options[nextIndex]);
                  }}
                >
                  <span>{timeRange}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC CHART AREA */}
          <div className="h-64 sm:h-72 w-full">
            {bookingTrendsQuery.isLoading ? (
              <div className="h-full w-full bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Loading booking trends...
                </span>
              </div>
            ) : timelineData.length === 0 ? (
              <div className="h-full w-full bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  No booking trends data available for this range
                </span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
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
                      border: '1px solid #1E293B',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#F8FAFC' }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                  />
                  <Bar dataKey="completed" name="Completed" fill="#006E1C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" name="Active / In Progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* RECENT BOOKINGS TABLE CARD (1 COL) - DYNAMIC FROM API */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between overflow-hidden transition-colors duration-200">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Recent Bookings
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Backend Data" />
            </div>
            <Link
              to="/bookings"
              className="text-xs font-bold text-[#006E1C] dark:text-emerald-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto flex-1 no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800">
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter">
                    DETAILS
                  </th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter text-right">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {recentBookingsQuery.isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-4">
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 mb-1.5" />
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-md w-1/2" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                      No recent bookings found
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((item) => {
                    const customerName = item.customer?.full_name || item.customer?.name || 'Customer';
                    const providerName = item.provider?.full_name || item.provider?.name || 'Unassigned';
                    const serviceName =
                      typeof item.service === 'string'
                        ? item.service
                        : item.service?.name || item.service?.title || item.service_name || 'General Service';
                    const bookingCode = item.booking_code || (item.id ? `#${item.id.slice(0, 8)}` : '');

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3 px-4">
                          <Link
                            to={`/bookings/${item.id}`}
                            className="block font-semibold text-slate-900 dark:text-slate-100 text-xs hover:text-[#006E1C] dark:hover:text-emerald-400 transition-colors truncate max-w-[200px]"
                          >
                            <span>{customerName}</span>
                            <span className="text-slate-400 mx-1.5">→</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{providerName}</span>
                          </Link>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1.5 mt-0.5 font-mono">
                            {bookingCode && <span className="font-bold text-slate-500 dark:text-slate-400">{bookingCode}</span>}
                            {bookingCode && <span>•</span>}
                            <span className="truncate max-w-[140px]">{serviceName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <BookingStatus status={item.status} size="sm" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

