import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../analytics.api';
import type { AnalyticsDateRange } from '../analytics.types';

export const ANALYTICS_QUERY_KEYS = {
  overview: (range: AnalyticsDateRange) => ['analytics', 'overview', range] as const,
  userGrowth: (range: AnalyticsDateRange) => ['analytics', 'user-growth', range] as const,
  bookingTrends: (range: AnalyticsDateRange) => ['analytics', 'booking-trends', range] as const,
  revenue: (range: AnalyticsDateRange) => ['analytics', 'revenue', range] as const,
  providerPerformance: () => ['analytics', 'provider-performance'] as const,
  engagement: (range: AnalyticsDateRange) => ['analytics', 'engagement', range] as const,
};

export const useAnalyticsOverviewQuery = (range: AnalyticsDateRange = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(range),
    queryFn: () => analyticsApi.getOverview(range),
    staleTime: 60000,
  });
};

export const useUserGrowthQuery = (range: AnalyticsDateRange = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.userGrowth(range),
    queryFn: () => analyticsApi.getUserGrowth(range),
    staleTime: 60000,
  });
};

export const useBookingTrendsQuery = (range: AnalyticsDateRange = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.bookingTrends(range),
    queryFn: () => analyticsApi.getBookingTrends(range),
    staleTime: 60000,
  });
};

export const useRevenuePerformanceQuery = (range: AnalyticsDateRange = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.revenue(range),
    queryFn: () => analyticsApi.getRevenuePerformance(range),
    staleTime: 60000,
  });
};

export const useProviderPerformanceQuery = () => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.providerPerformance(),
    queryFn: () => analyticsApi.getProviderPerformance(),
    staleTime: 60000,
  });
};

export const usePlatformEngagementQuery = (range: AnalyticsDateRange = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.engagement(range),
    queryFn: () => analyticsApi.getPlatformEngagement(range),
    staleTime: 60000,
  });
};
