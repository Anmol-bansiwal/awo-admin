import { apiFetch } from '../../api/apiUtils';
import { customerApi } from '../../api/customerApi';
import { providerApi } from '../../api/providerApi';
import { bookingApi } from '../../api/bookingApi';
import { financeApi } from '../finance/finance.api';
import type {
  AnalyticsDateRange,
  AnalyticsOverview,
  UserGrowthReport,
  BookingTrendsReport,
  RevenuePerformanceReport,
  ProviderPerformanceReport,
  ProviderPerformanceItem,
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

function parseDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

interface TimeBucket {
  label: string;
  startDate: Date;
  endDate: Date;
  dateKey: string;
}

function getTimeBuckets(range: AnalyticsDateRange): TimeBucket[] {
  const now = new Date();
  const buckets: TimeBucket[] = [];

  if (range === '7d') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateKey = d.toISOString().split('T')[0];
      buckets.push({ label, startDate: start, endDate: end, dateKey });
    }
  } else if (range === '30d') {
    for (let i = 3; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (i + 1) * 7);
      const end = new Date(now);
      end.setDate(now.getDate() - i * 7);
      const label = `Week ${4 - i}`;
      const dateKey = start.toISOString().split('T')[0];
      buckets.push({ label, startDate: start, endDate: end, dateKey });
    }
  } else if (range === '90d') {
    for (let i = 2; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = start.toLocaleDateString('en-US', { month: 'short' });
      const dateKey = start.toISOString().split('T')[0];
      buckets.push({ label, startDate: start, endDate: end, dateKey });
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = start.toLocaleDateString('en-US', { month: 'short' });
      const dateKey = start.toISOString().split('T')[0];
      buckets.push({ label, startDate: start, endDate: end, dateKey });
    }
  }

  return buckets;
}

let cachedDataPromise: Promise<{
  customers: any[];
  totalCustomers: number;
  providers: any[];
  totalProviders: number;
  bookings: any[];
  totalBookings: number;
  revenueSummary: any;
}> | null = null;
let lastFetchTime = 0;

/**
 * Concurrently fetches raw customer, provider, and booking records with a 10s cache window.
 */
async function fetchLivePlatformData() {
  const now = Date.now();
  if (cachedDataPromise && now - lastFetchTime < 10000) {
    return cachedDataPromise;
  }

  lastFetchTime = now;
  cachedDataPromise = (async () => {
    const [customersRes, providersRes, bookingsRes, revenueRes] = await Promise.allSettled([
      customerApi.getCustomers(1, 100),
      providerApi.getProviders(1, 100),
      bookingApi.getBookings(1, 100),
      financeApi.getRevenueReports('monthly').catch(() => null),
    ]);

    const { list: customers, total: totalCustomers } =
      customersRes.status === 'fulfilled' ? extractListAndTotal(customersRes.value) : { list: [], total: 0 };
    const { list: providers, total: totalProviders } =
      providersRes.status === 'fulfilled' ? extractListAndTotal(providersRes.value) : { list: [], total: 0 };
    const { list: bookings, total: totalBookings } =
      bookingsRes.status === 'fulfilled' ? extractListAndTotal(bookingsRes.value) : { list: [], total: 0 };
    const revenueSummary =
      revenueRes.status === 'fulfilled' ? (revenueRes.value as any)?.summary : null;

    return {
      customers,
      totalCustomers: totalCustomers || customers.length,
      providers,
      totalProviders: totalProviders || providers.length,
      bookings,
      totalBookings: totalBookings || bookings.length,
      revenueSummary,
    };
  })();

  return cachedDataPromise;
}

/**
 * Calculates high-level summary cards from live customer, provider, and booking entities.
 */
async function aggregateLiveOverview(): Promise<AnalyticsOverview> {
  const data = await fetchLivePlatformData();
  const totalUsersCount = data.totalCustomers + data.totalProviders;

  const activeProvidersCount =
    data.providers.filter((p: any) => p.status?.toString().toLowerCase() === 'active').length ||
    data.totalProviders;

  let calculatedRevenue =
    Number(data.revenueSummary?.total_revenue ?? data.revenueSummary?.grossRevenue ?? 0) || 0;
  if (!calculatedRevenue && data.bookings.length > 0) {
    calculatedRevenue = data.bookings.reduce<number>((acc, b: any) => {
      const status = b.status?.toString().toUpperCase();
      if (status === 'CANCELLED' || status === 'REJECTED') return acc;
      return acc + (Number(b.total_amount ?? b.amount ?? b.price ?? 0) || 0);
    }, 0);
  }

  const completedBookingsCount = data.bookings.filter(
    (b: any) => b.status?.toString().toUpperCase() === 'COMPLETED'
  ).length;
  const activeBookingsCount = data.bookings.filter((b: any) => {
    const st = b.status?.toString().toUpperCase();
    return st !== 'COMPLETED' && st !== 'CANCELLED' && st !== 'REJECTED';
  }).length;

  const calculatedEngagementRate =
    data.totalBookings > 0
      ? Math.min(100, Math.round((completedBookingsCount / data.totalBookings) * 1000) / 10)
      : 100;

  return {
    totalUsers: {
      title: 'Total Users',
      value: totalUsersCount.toLocaleString(),
      changePercentage: 0,
      isPositive: true,
      subtitle: `${data.totalCustomers} Customers, ${data.totalProviders} Providers`,
    },
    totalBookings: {
      title: 'Total Bookings',
      value: data.totalBookings.toLocaleString(),
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
      subtitle: `${activeProvidersCount} Active / ${data.totalProviders} Total`,
    },
    engagementRate: {
      title: 'Platform Engagement',
      value: `${calculatedEngagementRate}%`,
      changePercentage: 0,
      isPositive: true,
      subtitle: 'Completed booking rate',
    },
  };
}

/**
 * Calculates User Growth & Acquisition chart from live customer and provider registration dates.
 */
async function aggregateLiveUserGrowth(range: AnalyticsDateRange): Promise<UserGrowthReport> {
  const data = await fetchLivePlatformData();
  const buckets = getTimeBuckets(range);
  const totalUsers = data.totalCustomers + data.totalProviders;

  let newCustomersInRange = 0;
  let newProvidersInRange = 0;

  const timeline = buckets.map((bucket) => {
    const cCount = data.customers.filter((c: any) => {
      const d = parseDate(c.created_at);
      return d ? d >= bucket.startDate && d <= bucket.endDate : false;
    }).length;
    const pCount = data.providers.filter((p: any) => {
      const d = parseDate(p.created_at);
      return d ? d >= bucket.startDate && d <= bucket.endDate : false;
    }).length;

    newCustomersInRange += cCount;
    newProvidersInRange += pCount;

    return {
      date: bucket.dateKey,
      label: bucket.label,
      customers: cCount,
      providers: pCount,
      total: cCount + pCount,
    };
  });

  const growthRate =
    totalUsers > 0
      ? Math.round(((newCustomersInRange + newProvidersInRange) / totalUsers) * 1000) / 10
      : 0;

  return {
    summary: {
      totalUsers,
      newCustomers: newCustomersInRange,
      newProviders: newProvidersInRange,
      growthRate,
    },
    timeline,
  };
}

/**
 * Calculates Booking Trends from live booking records and status values.
 */
async function aggregateLiveBookingTrends(range: AnalyticsDateRange): Promise<BookingTrendsReport> {
  const data = await fetchLivePlatformData();
  const buckets = getTimeBuckets(range);

  const timeline = buckets.map((bucket) => {
    const bucketBookings = data.bookings.filter((b: any) => {
      const d = parseDate(b.created_at);
      return d ? d >= bucket.startDate && d <= bucket.endDate : false;
    });

    const comp = bucketBookings.filter(
      (b: any) => b.status?.toString().toUpperCase() === 'COMPLETED'
    ).length;
    const canc = bucketBookings.filter((b: any) => {
      const st = b.status?.toString().toUpperCase();
      return st === 'CANCELLED' || st === 'REJECTED';
    }).length;
    const act = bucketBookings.length - comp - canc;

    return {
      date: bucket.dateKey,
      label: bucket.label,
      completed: comp,
      active: act,
      cancelled: canc,
      total: bucketBookings.length,
    };
  });

  const allCompleted = data.bookings.filter(
    (b: any) => b.status?.toString().toUpperCase() === 'COMPLETED'
  ).length;
  const allCancelled = data.bookings.filter((b: any) => {
    const st = b.status?.toString().toUpperCase();
    return st === 'CANCELLED' || st === 'REJECTED';
  }).length;

  const completionRate =
    data.totalBookings > 0
      ? Math.round((allCompleted / data.totalBookings) * 1000) / 10
      : 100;

  return {
    summary: {
      totalBookings: data.totalBookings,
      completedBookings: allCompleted,
      cancelledBookings: allCancelled,
      completionRate,
    },
    timeline,
  };
}

/**
 * Calculates Revenue & Commission breakdown from live booking payments.
 */
async function aggregateLiveRevenuePerformance(range: AnalyticsDateRange): Promise<RevenuePerformanceReport> {
  const data = await fetchLivePlatformData();
  const buckets = getTimeBuckets(range);

  let totalGross =
    Number(data.revenueSummary?.total_revenue ?? data.revenueSummary?.grossRevenue ?? 0) || 0;
  if (!totalGross && data.bookings.length > 0) {
    totalGross = data.bookings.reduce<number>((acc, b: any) => {
      const status = b.status?.toString().toUpperCase();
      if (status === 'CANCELLED' || status === 'REJECTED') return acc;
      return acc + (Number(b.total_amount ?? b.amount ?? b.price ?? 0) || 0);
    }, 0);
  }

  const timeline = buckets.map((bucket) => {
    const bucketBookings = data.bookings.filter((b: any) => {
      const d = parseDate(b.created_at);
      return d ? d >= bucket.startDate && d <= bucket.endDate : false;
    });

    const rev = bucketBookings.reduce<number>((acc, b: any) => {
      const status = b.status?.toString().toUpperCase();
      if (status === 'CANCELLED' || status === 'REJECTED') return acc;
      return acc + (Number(b.total_amount ?? b.amount ?? b.price ?? 0) || 0);
    }, 0);

    const comm = Math.round(rev * 0.15 * 100) / 100;

    return {
      date: bucket.dateKey,
      label: bucket.label,
      grossRevenue: rev,
      commission: comm,
      payouts: rev - comm,
    };
  });

  const totalCommission = Math.round(totalGross * 0.15 * 100) / 100;
  const totalPayouts = totalGross - totalCommission;

  return {
    summary: {
      grossRevenue: totalGross,
      totalCommission,
      totalPayouts,
      currency: 'EUR',
    },
    timeline,
  };
}

/**
 * Calculates Platform Engagement and retention metrics directly from live booking and customer activity.
 */
async function aggregateLivePlatformEngagement(range: AnalyticsDateRange): Promise<PlatformEngagementReport> {
  const data = await fetchLivePlatformData();
  const buckets = getTimeBuckets(range);

  const activeCustomerIds = new Set<string>();
  const activeProviderIds = new Set<string>();
  const bookingCountPerCustomer: Record<string, number> = {};

  data.bookings.forEach((b: any) => {
    if (b.customer_id) {
      activeCustomerIds.add(String(b.customer_id));
      bookingCountPerCustomer[String(b.customer_id)] =
        (bookingCountPerCustomer[String(b.customer_id)] || 0) + 1;
    }
    if (b.provider_id) {
      activeProviderIds.add(String(b.provider_id));
    }
  });

  const repeatCustomersCount = Object.values(bookingCountPerCustomer).filter((c) => c > 1).length;
  const repeatRate =
    activeCustomerIds.size > 0
      ? Math.round((repeatCustomersCount / activeCustomerIds.size) * 1000) / 10
      : 0;

  const totalActiveUsers =
    activeCustomerIds.size + activeProviderIds.size || data.totalCustomers + data.totalProviders;

  const timeline = buckets.map((bucket) => {
    const bucketBookings = data.bookings.filter((b: any) => {
      const d = parseDate(b.created_at);
      return d ? d >= bucket.startDate && d <= bucket.endDate : false;
    });

    const activeInBucket = new Set<string>();
    bucketBookings.forEach((b: any) => {
      if (b.customer_id) activeInBucket.add(String(b.customer_id));
      if (b.provider_id) activeInBucket.add(String(b.provider_id));
    });

    const compMissions = bucketBookings.filter(
      (b: any) => b.status?.toString().toUpperCase() === 'COMPLETED'
    ).length;

    return {
      date: bucket.dateKey,
      label: bucket.label,
      activeUsers: activeInBucket.size,
      completedMissions: compMissions,
      repeatBookings:
        bucketBookings.length > compMissions ? bucketBookings.length - compMissions : 0,
    };
  });

  return {
    summary: {
      monthlyActiveUsers: totalActiveUsers,
      repeatBookingRate: repeatRate,
      averageJobsPerUser:
        activeCustomerIds.size > 0
          ? Math.round((data.totalBookings / activeCustomerIds.size) * 10) / 10
          : 0,
    },
    timeline,
  };
}

/**
 * Calculates provider performance breakdown directly from live provider accounts and bookings.
 */
async function fetchProviderPerformanceFromApi(): Promise<ProviderPerformanceReport> {
  const data = await fetchLivePlatformData();
  const providerList = data.providers;
  const bookingsList = data.bookings;

  const mappedProviders: ProviderPerformanceItem[] = providerList.map((p) => {
    const pBookings = bookingsList.filter(
      (b: any) => String(b.provider_id) === String(p.id) || String(b.provider?.id) === String(p.id)
    );

    const completed = pBookings.filter(
      (b: any) => b.status?.toString().toUpperCase() === 'COMPLETED'
    ).length;
    const cancelled = pBookings.filter((b: any) => {
      const st = b.status?.toString().toUpperCase();
      return st === 'CANCELLED' || st === 'REJECTED';
    }).length;
    const total = pBookings.length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 1000) / 10 : 100;

    const grossRevenue = pBookings.reduce<number>((sum, b: any) => {
      const st = b.status?.toString().toUpperCase();
      if (st === 'CANCELLED' || st === 'REJECTED') return sum;
      return sum + (Number(b.total_amount ?? b.amount ?? b.price ?? 0) || 0);
    }, 0);

    const statusVal = p.status?.toString().toLowerCase();
    const normalizedStatus: 'active' | 'suspended' | 'pending' =
      statusVal === 'suspended' ? 'suspended' : statusVal === 'pending' ? 'pending' : 'active';

    const category =
      (p as any).category_name ||
      p.provider?.skills?.[0] ||
      pBookings[0]?.category_name ||
      pBookings[0]?.service_name ||
      'General Services';

    return {
      id: p.id,
      name: p.full_name || 'Service Provider',
      email: p.email || '—',
      category,
      totalBookings: total,
      completedBookings: completed,
      cancelledBookings: cancelled,
      completionRate,
      grossRevenue,
      status: normalizedStatus,
    };
  });

  const activeCount = mappedProviders.filter((p) => p.status === 'active').length;
  const avgCompRate =
    mappedProviders.length > 0
      ? Math.round(
          mappedProviders.reduce((acc, p) => acc + p.completionRate, 0) / mappedProviders.length
        )
      : 100;

  return {
    summary: {
      totalActiveProviders: activeCount || providerList.length,
      averageCompletionRate: avgCompRate,
      topCategory: mappedProviders[0]?.category || 'General Services',
    },
    providers: mappedProviders,
  };
}

export const analyticsApi = {
  getOverview: async (range: AnalyticsDateRange = '30d'): Promise<AnalyticsOverview> => {
    try {
      const res = await apiFetch<{ data?: AnalyticsOverview } | AnalyticsOverview>(
        `/api/v1/admin/analytics/overview?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) return res.data;
      if (res && typeof res === 'object' && 'totalUsers' in res) return res as AnalyticsOverview;
      return await aggregateLiveOverview();
    } catch {
      return await aggregateLiveOverview();
    }
  },

  getUserGrowth: async (range: AnalyticsDateRange = '30d'): Promise<UserGrowthReport> => {
    try {
      const res = await apiFetch<{ data?: UserGrowthReport } | UserGrowthReport>(
        `/api/v1/admin/analytics/user-growth?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) return res.data;
      if (res && typeof res === 'object' && 'timeline' in res) return res as UserGrowthReport;
      return await aggregateLiveUserGrowth(range);
    } catch {
      return await aggregateLiveUserGrowth(range);
    }
  },

  getBookingTrends: async (range: AnalyticsDateRange = '30d'): Promise<BookingTrendsReport> => {
    try {
      const res = await apiFetch<{ data?: BookingTrendsReport } | BookingTrendsReport>(
        `/api/v1/admin/analytics/booking-trends?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) return res.data;
      if (res && typeof res === 'object' && 'timeline' in res) return res as BookingTrendsReport;
      return await aggregateLiveBookingTrends(range);
    } catch {
      return await aggregateLiveBookingTrends(range);
    }
  },

  getRevenuePerformance: async (range: AnalyticsDateRange = '30d'): Promise<RevenuePerformanceReport> => {
    try {
      const res = await apiFetch<{ data?: RevenuePerformanceReport } | RevenuePerformanceReport>(
        `/api/v1/admin/analytics/revenue?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) return res.data;
      if (res && typeof res === 'object' && 'timeline' in res) return res as RevenuePerformanceReport;
      return await aggregateLiveRevenuePerformance(range);
    } catch {
      return await aggregateLiveRevenuePerformance(range);
    }
  },

  getProviderPerformance: async (): Promise<ProviderPerformanceReport> => {
    try {
      const res = await apiFetch<{ data?: ProviderPerformanceReport } | ProviderPerformanceReport>(
        '/api/v1/admin/analytics/providers'
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) return res.data;
      if (res && typeof res === 'object' && 'providers' in res) return res as ProviderPerformanceReport;
      return await fetchProviderPerformanceFromApi();
    } catch {
      return await fetchProviderPerformanceFromApi();
    }
  },

  getPlatformEngagement: async (range: AnalyticsDateRange = '30d'): Promise<PlatformEngagementReport> => {
    try {
      const res = await apiFetch<{ data?: PlatformEngagementReport } | PlatformEngagementReport>(
        `/api/v1/admin/analytics/engagement?range=${range}`
      );
      if (res && typeof res === 'object' && 'data' in res && res.data) return res.data;
      if (res && typeof res === 'object' && 'timeline' in res) return res as PlatformEngagementReport;
      return await aggregateLivePlatformEngagement(range);
    } catch {
      return await aggregateLivePlatformEngagement(range);
    }
  },
};
