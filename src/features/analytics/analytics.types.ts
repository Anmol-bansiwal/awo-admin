export type AnalyticsDateRange = '7d' | '30d' | '90d' | '12m';

export interface AnalyticsSummaryMetric {
  title: string;
  value: string;
  rawNumber: number;
  changePercentage: number;
  isPositive: boolean;
  subtitle: string;
}

export interface AnalyticsOverview {
  totalUsers: AnalyticsSummaryMetric;
  totalBookings: AnalyticsSummaryMetric;
  grossRevenue: AnalyticsSummaryMetric;
  activeProviders: AnalyticsSummaryMetric;
  engagementRate: AnalyticsSummaryMetric;
}

export interface UserGrowthDataPoint {
  date: string;
  label: string;
  customers: number;
  providers: number;
  total: number;
}

export interface UserGrowthReport {
  summary: {
    totalUsers: number;
    newCustomers: number;
    newProviders: number;
    growthRate: number;
  };
  timeline: UserGrowthDataPoint[];
}

export interface BookingTrendsDataPoint {
  date: string;
  label: string;
  completed: number;
  active: number;
  cancelled: number;
  total: number;
}

export interface BookingTrendsReport {
  summary: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    completionRate: number;
  };
  timeline: BookingTrendsDataPoint[];
}

export interface RevenuePerformanceDataPoint {
  date: string;
  label: string;
  grossRevenue: number;
  commission: number;
  payouts: number;
}

export interface RevenuePerformanceReport {
  summary: {
    grossRevenue: number;
    totalCommission: number;
    totalPayouts: number;
    currency: string;
  };
  timeline: RevenuePerformanceDataPoint[];
}

export interface ProviderPerformanceItem {
  id: string;
  name: string;
  email: string;
  category: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  grossRevenue: number;
  status: 'active' | 'suspended' | 'pending';
}

export interface ProviderPerformanceReport {
  summary: {
    totalActiveProviders: number;
    averageCompletionRate: number;
    topCategory: string;
  };
  providers: ProviderPerformanceItem[];
}

export interface PlatformEngagementDataPoint {
  date: string;
  label: string;
  activeUsers: number;
  completedMissions: number;
  repeatBookings: number;
}

export interface PlatformEngagementReport {
  summary: {
    monthlyActiveUsers: number;
    repeatBookingRate: number;
    averageJobsPerUser: number;
  };
  timeline: PlatformEngagementDataPoint[];
}
