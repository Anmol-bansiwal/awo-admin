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
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY }),
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

  // Metrics: Live for Customers, Providers & Pending KYC; static for unbacked metrics
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
      value: '435',
      subtitle: 'In progress today',
      icon: Calendar,
      iconBgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-[#006E1C] dark:text-emerald-400',
    },
    {
      title: 'COMPLETED BOOKINGS',
      value: '4,830',
      subtitle: 'All time',
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
      title: 'OPEN COMPLAINTS',
      value: '12',
      subtitle: 'Needs attention',
      isWarning: true,
      icon: AlertTriangle,
      iconBgColor: 'bg-rose-50 dark:bg-rose-950/40',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  // Static sample recent bookings
  const staticRecentBookings = [
    {
      id: 'BK-9021',
      customer: 'Johnathan Miller',
      provider: 'Michael Dubois',
      service: 'Plumbing & Drainage',
      status: 'Active',
      statusType: 'success',
    },
    {
      id: 'BK-9022',
      customer: 'Elena Rostova',
      provider: 'Claire Moreau',
      service: 'Home Cleaning',
      status: 'Completed',
      statusType: 'secondary',
    },
    {
      id: 'BK-9023',
      customer: 'David Guerin',
      provider: 'Alex Fontana',
      service: 'Electrical Diagnostics',
      status: 'Pending',
      statusType: 'warning',
    },
    {
      id: 'BK-9024',
      customer: 'Lisa Bernard',
      provider: 'Tom Roux',
      service: 'Gardening & Landscaping',
      status: 'Active',
      statusType: 'success',
    },
  ];

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
            className={`w-3.5 h-3.5 text-[#006E1C] dark:text-emerald-400 ${
              isRefreshing ? 'animate-spin' : ''
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
        {/* BOOKING TRENDS CHART CARD (2 COLS) - STATIC VISUALIZATION */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Booking Trends
              </h2>
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

          {/* VISUAL CHART AREA */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-50/70 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-end justify-between gap-3 overflow-hidden">
            {/* Chart Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-30">
              <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
              <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
              <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
              <div className="border-b border-slate-300 dark:border-slate-700 w-full" />
            </div>

            {/* Simulated Chart Bars */}
            {[
              { height: '25%', label: 'W1' },
              { height: '40%', label: 'W2' },
              { height: '55%', label: 'W3' },
              { height: '50%', label: 'W4' },
              { height: '65%', label: 'W5' },
              { height: '80%', label: 'W6' },
              { height: '95%', label: 'W7' },
            ].map((bar, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center h-full justify-end group z-10"
              >
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-[#006E1C]/40 group-hover:bg-[#006E1C] dark:bg-emerald-500/30 dark:group-hover:bg-emerald-500 rounded-t-lg transition-all duration-300 cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-xs pointer-events-none transition-opacity whitespace-nowrap z-20 border border-slate-700/60 shadow-md">
                    {bar.height} Growth
                  </div>
                </div>
              </div>
            ))}

            {/* Label watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-900/80 px-3 py-1 rounded-full shadow-xs border border-slate-200 dark:border-slate-800">
                Chart Area (Platform Growth)
              </span>
            </div>
          </div>
        </div>

        {/* RECENT BOOKINGS TABLE CARD (1 COL) - STATIC PREVIEW */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between overflow-hidden transition-colors duration-200">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Recent Bookings
              </h2>
            </div>
            <Link
              to="/bookings"
              className="text-xs font-bold text-[#006E1C] dark:text-emerald-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800">
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter">
                    DETAILS
                  </th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-inter text-right">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {staticRecentBookings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {item.customer} &rarr; {item.provider}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {item.service}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {item.statusType === 'success' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                          Active
                        </span>
                      )}
                      {item.statusType === 'secondary' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                          Completed
                        </span>
                      )}
                      {item.statusType === 'warning' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

