import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  Calendar,
  CheckCircle,
  Banknote,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { CUSTOMERS_QUERY_KEY, useCustomersQuery } from '../features/customers/hooks/useCustomers';
import { PROVIDERS_QUERY_KEY, useProvidersQuery } from '../features/providers/hooks/useProviders';
import { BOOKINGS_QUERY_KEY, useBookingsQuery } from '../features/bookings/hooks/useBookings';
import { ANALYTICS_QUERY_KEYS, useBookingTrendsQuery, useRevenuePerformanceQuery } from '../features/analytics/hooks/useAnalytics';
import { useEscrowSummaryQuery } from '../features/finance/hooks/useEscrow';
import type { AnalyticsDateRange } from '../features/analytics/analytics.types';
import type { Booking } from '../features/bookings/bookings.types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Live backend data hooks
  const customersQuery = useCustomersQuery(1, 1);
  const providersQuery = useProvidersQuery(1, 1);
  const allBookingsQuery = useBookingsQuery(1, 100);
  const completedBookingsQuery = useBookingsQuery(1, 1, 'COMPLETED');
  const cancelledBookingsQuery = useBookingsQuery(1, 1, 'CANCELLED');
  const rejectedBookingsQuery = useBookingsQuery(1, 1, 'REJECTED');

  const mapRangeToKey = (label: string): AnalyticsDateRange => {
    if (label === 'Last 7 Days') return '7d';
    if (label === 'This Year') return '12m';
    return '30d';
  };

  const currentRangeKey = mapRangeToKey(timeRange);
  const bookingTrendsQuery = useBookingTrendsQuery(currentRangeKey);
  const revenueQuery = useRevenuePerformanceQuery(currentRangeKey);
  const escrowSummaryQuery = useEscrowSummaryQuery();

  const recentBookingsQuery = useBookingsQuery(1, 6);
  const recentBookings: Booking[] = Array.isArray(recentBookingsQuery.data?.data)
    ? recentBookingsQuery.data.data
    : [];

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
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.revenue(rangeKey) }),
      queryClient.invalidateQueries({ queryKey: ['escrow-summary'] }),
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Dynamic values from live backend APIs
  const customersCount = customersQuery.data?.metadata?.total ?? 0;
  const providersCount = providersQuery.data?.metadata?.total ?? 0;
  const totalUsersSum = customersCount + providersCount;

  const liveTotalCustomers = customersQuery.isLoading
    ? '...'
    : customersCount.toLocaleString();

  const liveTotalProviders = providersQuery.isLoading
    ? '...'
    : providersCount.toLocaleString();

  const liveTotalUsers = (customersQuery.isLoading || providersQuery.isLoading)
    ? '...'
    : totalUsersSum.toLocaleString();

  const trendsData = bookingTrendsQuery.data;
  const timelineData = trendsData?.timeline || [];

  // Robust booking metrics aggregation
  const allBookings = Array.isArray(allBookingsQuery.data?.data)
    ? allBookingsQuery.data.data
    : [];

  const totalBookingsCount =
    allBookingsQuery.data?.metadata?.total ??
    trendsData?.summary?.totalBookings ??
    allBookings.length;

  // Completed bookings
  const completedApiCount = completedBookingsQuery.data?.metadata?.total ?? 0;
  const completedListCount = allBookings.filter(
    (b) => (b.status || '').toUpperCase() === 'COMPLETED'
  ).length;
  const liveCompletedBookingsCount = Math.max(
    completedApiCount,
    completedListCount,
    trendsData?.summary?.completedBookings ?? 0
  );

  // Rejected / Cancelled bookings
  const cancelledApiCount =
    (cancelledBookingsQuery.data?.metadata?.total ?? 0) +
    (rejectedBookingsQuery.data?.metadata?.total ?? 0);
  const cancelledListCount = allBookings.filter((b) => {
    const s = (b.status || '').toUpperCase();
    return s === 'CANCELLED' || s === 'CANCELED' || s === 'REJECTED';
  }).length;
  const liveRejectedBookingsCount = Math.max(
    cancelledApiCount,
    cancelledListCount,
    trendsData?.summary?.cancelledBookings ?? 0
  );

  // Active bookings (in progress, accepted, assigned, en route, pending)
  const activeListCount = allBookings.filter((b) => {
    const s = (b.status || '').toUpperCase();
    return [
      'ACTIVE',
      'IN_PROGRESS',
      'INPROGRESS',
      'EN_ROUTE',
      'ENROUTE',
      'ASSIGNED',
      'ACCEPTED',
      'PENDING',
    ].includes(s);
  }).length;
  const calculatedActive = Math.max(
    0,
    totalBookingsCount - liveCompletedBookingsCount - liveRejectedBookingsCount
  );
  const liveActiveBookingsCount = Math.max(activeListCount, calculatedActive);

  const isBookingsLoading =
    allBookingsQuery.isLoading &&
    completedBookingsQuery.isLoading &&
    cancelledBookingsQuery.isLoading;

  const liveActiveBookings = isBookingsLoading
    ? '...'
    : liveActiveBookingsCount.toLocaleString();

  const liveCompletedBookings = isBookingsLoading
    ? '...'
    : liveCompletedBookingsCount.toLocaleString();

  const liveRejectedBookings = isBookingsLoading
    ? '...'
    : liveRejectedBookingsCount.toLocaleString();

  const liveRevenue =
    revenueQuery.data?.summary?.grossRevenue !== undefined
      ? `€${revenueQuery.data.summary.grossRevenue.toLocaleString()}`
      : revenueQuery.isLoading
      ? '...'
      : '€0';

  const escrowTotal = escrowSummaryQuery.data?.total_escrow ?? (escrowSummaryQuery.data as any)?.total_held;
  const liveEscrow =
    escrowTotal !== undefined
      ? `€${escrowTotal.toLocaleString()}`
      : escrowSummaryQuery.isLoading
      ? '...'
      : '€0';

  return (
    <div className="space-y-7 animate-in fade-in duration-300 relative">
      {/* SECTION HEADER: Platform Overview + Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Platform Overview
        </h2>
        <button
          type="button"
          onClick={() => handleRefreshData()}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#38B449] dark:text-emerald-400 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* TOP METRICS SECTION: Hero Card (Total Users) + 5 Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* HERO CARD: TOTAL USERS with Customers & Providers breakdown (Vibrant emerald-to-teal gradient on hover) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 hover:border-transparent shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 flex flex-col justify-between relative overflow-hidden min-h-[220px] group transition-all duration-300">
          {/* Green hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Frosted Icon & View Details */}
          <div className="flex items-start justify-between relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 group-hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-[#38B449] dark:text-emerald-400 group-hover:text-white group-hover:ring-1 group-hover:ring-white/30 shadow-xs transition-all duration-300">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          {/* Metric Details */}
          <div className="mt-5 relative z-10">
            <div className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-white/90 uppercase transition-colors duration-300">
              TOTAL USERS
            </div>
            <div className="mt-1 flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#38B449] dark:text-emerald-400 group-hover:text-white tracking-tight leading-none transition-colors duration-300">
                {liveTotalUsers}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-white/85 font-medium transition-colors duration-300">
                In progress now
              </span>
            </div>

            {/* Total Customers and Total Providers Breakdown */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 group-hover:border-white/20 grid grid-cols-2 gap-3 transition-colors duration-300">
              <Link
                to="/customers"
                className="bg-slate-50 dark:bg-slate-800/60 group-hover:bg-white/15 hover:bg-slate-100 dark:hover:bg-slate-800 group-hover:hover:bg-white/25 border border-slate-200/60 dark:border-slate-700/60 group-hover:border-white/20 backdrop-blur-xs rounded-xl p-2.5 transition-all duration-200 group/item cursor-pointer"
              >
                <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-white/85 uppercase flex items-center justify-between transition-colors duration-200">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 shrink-0" />
                    <span>CUSTOMERS</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-white/80 group-hover/item:text-white transition-all" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-white mt-1 leading-tight transition-colors duration-200">
                  {liveTotalCustomers}
                </div>
              </Link>
              <Link
                to="/providers"
                className="bg-slate-50 dark:bg-slate-800/60 group-hover:bg-white/15 hover:bg-slate-100 dark:hover:bg-slate-800 group-hover:hover:bg-white/25 border border-slate-200/60 dark:border-slate-700/60 group-hover:border-white/20 backdrop-blur-xs rounded-xl p-2.5 transition-all duration-200 group/item cursor-pointer"
              >
                <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-white/85 uppercase flex items-center justify-between transition-colors duration-200">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3 shrink-0" />
                    <span>PROVIDERS</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-white/80 group-hover/item:text-white transition-all" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-white mt-1 leading-tight transition-colors duration-200">
                  {liveTotalProviders}
                </div>
              </Link>
            </div>
          </div>

          {/* Subtle ambient light glow */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* RIGHT METRICS GRID: 2 top cards + 3 bottom cards */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
          {/* Top Row: REVENUE & IN ESCROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* REVENUE */}
            <Link
              to="/revenue-reports"
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-transparent shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between relative z-10">
                <div className="w-11 h-11 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 group-hover:bg-white/20 group-hover:ring-1 group-hover:ring-white/30 flex items-center justify-center text-[#38B449] dark:text-emerald-400 group-hover:text-white transition-all duration-300">
                  <Banknote className="w-5 h-5 stroke-[2]" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="mt-4 relative z-10">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#38B449] dark:text-emerald-400 group-hover:text-white tracking-tight transition-colors duration-300">
                  {liveRevenue}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-white/90 mt-1 transition-colors duration-300">
                  REVENUE
                </div>
              </div>
            </Link>

            {/* IN ESCROW */}
            <Link
              to="/escrow"
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-transparent shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between relative z-10">
                <div className="w-11 h-11 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 group-hover:bg-white/20 group-hover:ring-1 group-hover:ring-white/30 flex items-center justify-center text-[#38B449] dark:text-emerald-400 group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="mt-4 relative z-10">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#38B449] dark:text-emerald-400 group-hover:text-white tracking-tight transition-colors duration-300">
                  {liveEscrow}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-white/90 mt-1 transition-colors duration-300">
                  IN ESCROW
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Row: ACTIVE BOOKINGS, COMPLETED BOOKINGS, REJECTED BOOKINGS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* ACTIVE BOOKINGS */}
            <Link
              to="/bookings?status=active"
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-transparent shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 group-hover:bg-white/20 group-hover:ring-1 group-hover:ring-white/30 flex items-center justify-center text-[#38B449] dark:text-emerald-400 group-hover:text-white transition-all duration-300">
                  <Calendar className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <ArrowUpRight className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="mt-3 relative z-10">
                <div className="text-2xl font-extrabold text-[#38B449] dark:text-emerald-400 group-hover:text-white tracking-tight transition-colors duration-300">
                  {liveActiveBookings}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-white/90 mt-1 transition-colors duration-300">
                  ACTIVE BOOKINGS
                </div>
              </div>
            </Link>

            {/* COMPLETED BOOKINGS */}
            <Link
              to="/bookings?status=completed"
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-transparent shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 group-hover:bg-white/20 group-hover:ring-1 group-hover:ring-white/30 flex items-center justify-center text-[#38B449] dark:text-emerald-400 group-hover:text-white transition-all duration-300">
                  <CheckCircle className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <ArrowUpRight className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="mt-3 relative z-10">
                <div className="text-2xl font-extrabold text-[#38B449] dark:text-emerald-400 group-hover:text-white tracking-tight transition-colors duration-300">
                  {liveCompletedBookings}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-white/90 mt-1 transition-colors duration-300">
                  COMPLETED BOOKINGS
                </div>
              </div>
            </Link>

            {/* REJECTED BOOKINGS */}
            <Link
              to="/bookings?status=cancelled"
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-transparent shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 group-hover:bg-white/20 group-hover:ring-1 group-hover:ring-white/30 flex items-center justify-center text-[#38B449] dark:text-emerald-400 group-hover:text-white transition-all duration-300">
                  <AlertTriangle className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <ArrowUpRight className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="mt-3 relative z-10">
                <div className="text-2xl font-extrabold text-[#38B449] dark:text-emerald-400 group-hover:text-white tracking-tight transition-colors duration-300">
                  {liveRejectedBookings}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-white/90 mt-1 transition-colors duration-300">
                  REJECTED BOOKINGS
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: BOOKING TRENDS CHART & RECENT BOOKINGS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BOOKING TRENDS CHART CARD (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Booking Trends
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Backend Data" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Activity volume breakdown by status
              </p>
            </div>

            {/* Custom Legend Dots + Range Selector */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  <span>Active / In Progress</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span>Cancelled</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#38B449] dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38B449] inline-block" />
                  <span>Completed</span>
                </div>
              </div>

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

          {/* CHART AREA */}
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.35} />
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
                  <Bar dataKey="active" name="Active / In Progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#38B449" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* RECENT BOOKINGS CARD (1 COL) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between overflow-hidden transition-colors duration-200">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>Recent Bookings</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </h3>
            </div>
            <Link
              to="/bookings"
              className="text-xs font-bold text-[#38B449] dark:text-emerald-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto flex-1 no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800">
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-inter">
                    DETAILS
                  </th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-inter text-right">
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
                        : item.service?.name || item.service?.title || item.service_name || 'Electrical';
                    const bookingCode = item.booking_code || (item.id ? `#${item.id.slice(0, 8)}` : '');

                    const normalizedStatus = (item.status || '').toUpperCase();
                    const isCancelled = normalizedStatus === 'CANCELLED' || normalizedStatus === 'REJECTED';
                    const isCompleted = normalizedStatus === 'COMPLETED';

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3 px-4">
                          <Link
                            to={`/bookings/${item.id}`}
                            className="block font-semibold text-slate-900 dark:text-slate-100 text-xs hover:text-[#38B449] dark:hover:text-emerald-400 transition-colors truncate max-w-[200px]"
                          >
                            <span>{customerName}</span>
                            <span className="text-slate-400 mx-1.5">—</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{providerName}</span>
                          </Link>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1.5 mt-0.5 font-mono">
                            {bookingCode && <span className="font-bold text-slate-500 dark:text-slate-400">{bookingCode}</span>}
                            {bookingCode && <span>•</span>}
                            <span className="truncate max-w-[140px]">{serviceName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {isCancelled ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Cancelled
                            </span>
                          ) : isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {item.status || 'Active'}
                            </span>
                          )}
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
