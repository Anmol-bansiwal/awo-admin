import { apiFetch } from '../../api/apiUtils';
import type {
  AnalyticsDateRange,
  AnalyticsOverview,
  UserGrowthReport,
  BookingTrendsReport,
  RevenuePerformanceReport,
  ProviderPerformanceReport,
  PlatformEngagementReport,
} from './analytics.types';
import {
  getMockAnalyticsOverview,
  getMockUserGrowth,
  getMockBookingTrends,
  getMockRevenuePerformance,
  getMockProviderPerformance,
  getMockPlatformEngagement,
} from './mock/analytics.mock';

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
      return getMockAnalyticsOverview(range);
    } catch {
      return getMockAnalyticsOverview(range);
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
