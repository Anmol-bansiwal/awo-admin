import { apiFetch } from '../../api/apiUtils';
import { customerApi } from '../../api/customerApi';
import { providerApi } from '../../api/providerApi';
import { bookingApi } from '../../api/bookingApi';
import { financeApi } from '../finance/finance.api';
import {
  getMockAnalyticsOverview,
  getMockUserGrowth,
  getMockBookingTrends,
  getMockRevenuePerformance,
  getMockProviderPerformance,
  getMockPlatformEngagement,
} from './mock/analytics.mock';
import type {
  AnalyticsDateRange,
  AnalyticsOverview,
  UserGrowthReport,
  BookingTrendsReport,
  RevenuePerformanceReport,
  ProviderPerformanceReport,
  PlatformEngagementReport,
} from './analytics.types';

/**
 * Safely extracts array list and total count from API responses.
 */
function extractListAndTotal<T = any>(res: any): { list: T[]; total: number } {
  if (!res) return { list: [], total: 0 };
  const list: T[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  const total =
    typeof res?.metadata?.total === 'number'
      ? res.metadata.total
      : typeof res?.total === 'number'
        ? res.total
        : list.length;
  return { list, total };
}

/**
 * Aggregates high-level platform overview metrics directly from live customer, provider, and booking entities.
 */
async function aggregateLiveOverview(range: AnalyticsDateRange): Promise<AnalyticsOverview> {
  try {
    const [customersRes, providersRes, bookingsRes, revenueReport] = await Promise.allSettled([
      customerApi.getCustomers(1, 100),
      providerApi.getProviders(1, 100),
      bookingApi.getBookings(1, 100),
      financeApi.getRevenueReports('monthly').catch(() => null),
    ]);

    const { total: totalCustomers } =
      customersRes.status === 'fulfilled' ? extractListAndTotal(customersRes.value) : { total: 0 };
    const { list: providerList, total: totalProviders } =
      providersRes.status === 'fulfilled' ? extractListAndTotal(providersRes.value) : { list: [], total: 0 };
    const { list: bookingsList, total: totalBookingsCount } =
      bookingsRes.status === 'fulfilled' ? extractListAndTotal(bookingsRes.value) : { list: [], total: 0 };

    const totalUsersCount = totalCustomers + totalProviders;

    // If completely empty, fall back to realistic mock overview
    if (totalUsersCount === 0 && totalBookingsCount === 0) {
      return getMockAnalyticsOverview(range);
    }

    const revData = revenueReport.status === 'fulfilled' ? revenueReport.value : null;
    const revSummary = revData?.summary as any;

    const activeProvidersList = providerList.filter(
      (p: any) => p.status?.toString().toLowerCase() === 'active'
    );
    const activeProvidersCount = activeProvidersList.length || (totalProviders > 0 ? totalProviders : 0);

    let calculatedRevenue = Number(revSummary?.total_revenue ?? revSummary?.grossRevenue ?? 0) || 0;
    if (!calculatedRevenue && bookingsList.length > 0) {
      calculatedRevenue = bookingsList.reduce<number>((acc, b: any) => {
        const status = b.status?.toString().toUpperCase();
        if (status === 'CANCELLED' || status === 'REJECTED') return acc;
        return acc + (Number(b.total_amount ?? b.amount ?? b.price ?? 0) || 0);
      }, 0);
    }

    const completedBookingsCount = bookingsList.filter(
      (b: any) => b.status?.toString().toUpperCase() === 'COMPLETED'
    ).length;
    const activeBookingsCount = bookingsList.filter((b: any) => {
      const st = b.status?.toString().toUpperCase();
      return st !== 'COMPLETED' && st !== 'CANCELLED' && st !== 'REJECTED';
    }).length;

    const calculatedEngagementRate =
      totalBookingsCount > 0
        ? Math.min(100, Math.round((completedBookingsCount / totalBookingsCount) * 1000) / 10)
        : 0;

    return {
      totalUsers: {
        title: 'Total Users',
        value: totalUsersCount.toLocaleString(),
        changePercentage: 0,
        isPositive: true,
        subtitle: `${totalCustomers} Customers, ${totalProviders} Providers`,
      },
      totalBookings: {
        title: 'Total Bookings',
        value: totalBookingsCount.toLocaleString(),
        changePercentage: 0,
        isPositive: true,
        subtitle: `${completedBookingsCount} Completed, ${activeBookingsCount} Active`,
      },
      grossRevenue: {
        title: 'Gross Revenue',
        value: `€${calculatedRevenue.toLocaleString()}`,
        changePercentage: 0,
        isPositive: true,
        subtitle: 'Platform gross booking volume',
      },
      activeProviders: {
        title: 'Active Providers',
        value: activeProvidersCount.toLocaleString(),
        changePercentage: 0,
        isPositive: true,
        subtitle: `${activeProvidersCount} Active / ${totalProviders} Total`,
      },
      engagementRate: {
        title: 'Platform Engagement',
        value: `${calculatedEngagementRate}%`,
        changePercentage: 0,
        isPositive: true,
        subtitle: 'Completed booking rate',
      },
    };
  } catch {
    return getMockAnalyticsOverview(range);
  }
}

export const analyticsApi = {
  getOverview: async (range: AnalyticsDateRange = '30d'): Promise<AnalyticsOverview> => {
    try {
      const res = await apiFetch<{ data?: AnalyticsOverview } | AnalyticsOverview>(
        `/api/v1/admin/analytics/overview?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) {
        return res.data;
      }
      if (res && typeof res === 'object' && 'totalUsers' in res) {
        return res as AnalyticsOverview;
      }
      return await aggregateLiveOverview(range);
    } catch {
      return await aggregateLiveOverview(range);
    }
  },

  getUserGrowth: async (range: AnalyticsDateRange = '30d'): Promise<UserGrowthReport> => {
    try {
      const res = await apiFetch<{ data?: UserGrowthReport } | UserGrowthReport>(
        `/api/v1/admin/analytics/user-growth?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) {
        return res.data;
      }
      if (res && typeof res === 'object' && 'timeline' in res) {
        return res as UserGrowthReport;
      }
      return getMockUserGrowth(range);
    } catch {
      return getMockUserGrowth(range);
    }
  },

  getBookingTrends: async (range: AnalyticsDateRange = '30d'): Promise<BookingTrendsReport> => {
    try {
      const res = await apiFetch<{ data?: BookingTrendsReport } | BookingTrendsReport>(
        `/api/v1/admin/analytics/booking-trends?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) {
        return res.data;
      }
      if (res && typeof res === 'object' && 'timeline' in res) {
        return res as BookingTrendsReport;
      }
      return getMockBookingTrends(range);
    } catch {
      return getMockBookingTrends(range);
    }
  },

  getRevenuePerformance: async (range: AnalyticsDateRange = '30d'): Promise<RevenuePerformanceReport> => {
    try {
      const res = await apiFetch<{ data?: RevenuePerformanceReport } | RevenuePerformanceReport>(
        `/api/v1/admin/analytics/revenue?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) {
        return res.data;
      }
      if (res && typeof res === 'object' && 'timeline' in res) {
        return res as RevenuePerformanceReport;
      }
      return getMockRevenuePerformance(range);
    } catch {
      return getMockRevenuePerformance(range);
    }
  },

  getProviderPerformance: async (): Promise<ProviderPerformanceReport> => {
    try {
      const res = await apiFetch<{ data?: ProviderPerformanceReport } | ProviderPerformanceReport>(
        '/api/v1/admin/analytics/providers'
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) {
        return res.data;
      }
      if (res && typeof res === 'object' && 'providers' in res) {
        return res as ProviderPerformanceReport;
      }
      return getMockProviderPerformance();
    } catch {
      return getMockProviderPerformance();
    }
  },

  getPlatformEngagement: async (range: AnalyticsDateRange = '30d'): Promise<PlatformEngagementReport> => {
    try {
      const res = await apiFetch<{ data?: PlatformEngagementReport } | PlatformEngagementReport>(
        `/api/v1/admin/analytics/engagement?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) {
        return res.data;
      }
      if (res && typeof res === 'object' && 'timeline' in res) {
        return res as PlatformEngagementReport;
      }
      return getMockPlatformEngagement(range);
    } catch {
      return getMockPlatformEngagement(range);
    }
  },
};
