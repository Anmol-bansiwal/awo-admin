import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  RefreshCw,
  Users,
  Calendar,
  Banknote,
  UserCheck,
  Activity,
  Layers,
} from 'lucide-react';
import {
  useAnalyticsOverviewQuery,
  useUserGrowthQuery,
  useBookingTrendsQuery,
  useRevenuePerformanceQuery,
  useProviderPerformanceQuery,
  usePlatformEngagementQuery,
} from '../hooks/useAnalytics';
import { AnalyticsSummaryCards } from '../components/AnalyticsSummaryCards';
import { AnalyticsDateFilter } from '../components/AnalyticsDateFilter';
import { UserGrowthChart } from '../components/UserGrowthChart';
import { BookingTrendsChart } from '../components/BookingTrendsChart';
import { RevenuePerformanceChart } from '../components/RevenuePerformanceChart';
import { ProviderPerformanceTable } from '../components/ProviderPerformanceTable';
import { PlatformEngagementChart } from '../components/PlatformEngagementChart';
import type { AnalyticsDateRange } from '../analytics.types';

type TabType =
  | 'overview'
  | 'user-growth'
  | 'booking-trends'
  | 'revenue'
  | 'provider-performance'
  | 'engagement';

export const Analytics: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab: TabType = (tab as TabType) || 'overview';
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('30d');

  // Queries
  const overviewQuery = useAnalyticsOverviewQuery(dateRange);
  const userGrowthQuery = useUserGrowthQuery(dateRange);
  const bookingTrendsQuery = useBookingTrendsQuery(dateRange);
  const revenueQuery = useRevenuePerformanceQuery(dateRange);
  const providerQuery = useProviderPerformanceQuery();
  const engagementQuery = usePlatformEngagementQuery(dateRange);

  const isRefreshing =
    overviewQuery.isFetching ||
    userGrowthQuery.isFetching ||
    bookingTrendsQuery.isFetching ||
    revenueQuery.isFetching ||
    providerQuery.isFetching ||
    engagementQuery.isFetching;

  const handleRefresh = () => {
    overviewQuery.refetch();
    userGrowthQuery.refetch();
    bookingTrendsQuery.refetch();
    revenueQuery.refetch();
    providerQuery.refetch();
    engagementQuery.refetch();
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab === 'overview') {
      navigate('/analytics');
    } else {
      navigate(`/analytics/${newTab}`);
    }
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'user-growth', label: 'User Growth', icon: Users },
    { id: 'booking-trends', label: 'Booking Trends', icon: Calendar },
    { id: 'revenue', label: 'Revenue Performance', icon: Banknote },
    { id: 'provider-performance', label: 'Provider Performance', icon: UserCheck },
    { id: 'engagement', label: 'Platform Engagement', icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 shrink-0 shadow-2xs">
              <BarChart3 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Analytics & Reporting
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Platform operational metrics, growth velocity, and provider performance analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <AnalyticsDateFilter selectedRange={dateRange} onChange={setDateRange} />

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
            title="Refresh Analytics Data"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#006E1C] dark:text-emerald-400 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Segmented Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none p-1.5 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-[#006E1C] dark:text-emerald-400 font-bold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700/80'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-[#006E1C] dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Cards */}
      <AnalyticsSummaryCards
        overview={overviewQuery.data}
        isLoading={overviewQuery.isLoading}
      />

      {/* Tab Content Views */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserGrowthChart report={userGrowthQuery.data} isLoading={userGrowthQuery.isLoading} />
            <BookingTrendsChart
              report={bookingTrendsQuery.data}
              isLoading={bookingTrendsQuery.isLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenuePerformanceChart
              report={revenueQuery.data}
              isLoading={revenueQuery.isLoading}
            />
            <PlatformEngagementChart
              report={engagementQuery.data}
              isLoading={engagementQuery.isLoading}
            />
          </div>

          <ProviderPerformanceTable
            report={providerQuery.data}
            isLoading={providerQuery.isLoading}
          />
        </div>
      )}

      {activeTab === 'user-growth' && (
        <div className="space-y-6">
          <UserGrowthChart report={userGrowthQuery.data} isLoading={userGrowthQuery.isLoading} />
        </div>
      )}

      {activeTab === 'booking-trends' && (
        <div className="space-y-6">
          <BookingTrendsChart
            report={bookingTrendsQuery.data}
            isLoading={bookingTrendsQuery.isLoading}
          />
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <RevenuePerformanceChart
            report={revenueQuery.data}
            isLoading={revenueQuery.isLoading}
          />
        </div>
      )}

      {activeTab === 'provider-performance' && (
        <div className="space-y-6">
          <ProviderPerformanceTable
            report={providerQuery.data}
            isLoading={providerQuery.isLoading}
          />
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <PlatformEngagementChart
            report={engagementQuery.data}
            isLoading={engagementQuery.isLoading}
          />
        </div>
      )}
    </div>
  );
};
