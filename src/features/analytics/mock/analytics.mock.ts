import type {
  AnalyticsDateRange,
  AnalyticsOverview,
  UserGrowthReport,
  BookingTrendsReport,
  RevenuePerformanceReport,
  ProviderPerformanceReport,
  PlatformEngagementReport,
} from '../analytics.types';

export const getMockAnalyticsOverview = (range: AnalyticsDateRange): AnalyticsOverview => {
  const multiplier = range === '7d' ? 0.25 : range === '30d' ? 1 : range === '90d' ? 2.8 : 10.5;

  return {
    totalUsers: {
      title: 'Total Users',
      value: Math.round(12450 * multiplier).toLocaleString(),
      rawNumber: Math.round(12450 * multiplier),
      changePercentage: 14.8,
      isPositive: true,
      subtitle: '+1,240 vs previous period',
    },
    totalBookings: {
      title: 'Total Bookings',
      value: Math.round(2840 * multiplier).toLocaleString(),
      rawNumber: Math.round(2840 * multiplier),
      changePercentage: 8.2,
      isPositive: true,
      subtitle: '+215 vs previous period',
    },
    grossRevenue: {
      title: 'Gross Revenue',
      value: `€${Math.round(48320 * multiplier).toLocaleString()}`,
      rawNumber: Math.round(48320 * multiplier),
      changePercentage: 12.4,
      isPositive: true,
      subtitle: 'Platform total booking volume',
    },
    activeProviders: {
      title: 'Active Providers',
      value: Math.round(340 * (range === '7d' ? 0.8 : 1)).toLocaleString(),
      rawNumber: Math.round(340 * (range === '7d' ? 0.8 : 1)),
      changePercentage: 5.1,
      isPositive: true,
      subtitle: 'Verified & active pros',
    },
    engagementRate: {
      title: 'Platform Engagement',
      value: '78.4%',
      rawNumber: 78.4,
      changePercentage: 3.2,
      isPositive: true,
      subtitle: 'Active users returning monthly',
    },
  };
};

export const getMockUserGrowth = (range: AnalyticsDateRange): UserGrowthReport => {
  if (range === '7d') {
    return {
      summary: {
        totalUsers: 12450,
        newCustomers: 310,
        newProviders: 28,
        growthRate: 14.8,
      },
      timeline: [
        { date: '2026-09-15', label: 'Mon', customers: 42, providers: 4, total: 46 },
        { date: '2026-09-16', label: 'Tue', customers: 38, providers: 3, total: 41 },
        { date: '2026-09-17', label: 'Wed', customers: 45, providers: 5, total: 50 },
        { date: '2026-09-18', label: 'Thu', customers: 52, providers: 4, total: 56 },
        { date: '2026-09-19', label: 'Fri', customers: 48, providers: 3, total: 51 },
        { date: '2026-09-20', label: 'Sat', customers: 40, providers: 4, total: 44 },
        { date: '2026-09-21', label: 'Sun', customers: 45, providers: 5, total: 50 },
      ],
    };
  }

  if (range === '90d') {
    return {
      summary: {
        totalUsers: 14200,
        newCustomers: 3450,
        newProviders: 280,
        growthRate: 22.4,
      },
      timeline: [
        { date: '2026-07', label: 'July', customers: 1050, providers: 85, total: 1135 },
        { date: '2026-08', label: 'August', customers: 1180, providers: 92, total: 1272 },
        { date: '2026-09', label: 'September', customers: 1220, providers: 103, total: 1323 },
      ],
    };
  }

  if (range === '12m') {
    return {
      summary: {
        totalUsers: 18600,
        newCustomers: 12400,
        newProviders: 980,
        growthRate: 34.5,
      },
      timeline: [
        { date: '2025-10', label: 'Oct 25', customers: 680, providers: 50, total: 730 },
        { date: '2025-11', label: 'Nov 25', customers: 720, providers: 55, total: 775 },
        { date: '2025-12', label: 'Dec 25', customers: 850, providers: 65, total: 915 },
        { date: '2026-01', label: 'Jan 26', customers: 910, providers: 70, total: 980 },
        { date: '2026-02', label: 'Feb 26', customers: 880, providers: 68, total: 948 },
        { date: '2026-03', label: 'Mar 26', customers: 950, providers: 74, total: 1024 },
        { date: '2026-04', label: 'Apr 26', customers: 1020, providers: 80, total: 1100 },
        { date: '2026-05', label: 'May 26', customers: 1100, providers: 88, total: 1188 },
        { date: '2026-06', label: 'Jun 26', customers: 1150, providers: 90, total: 1240 },
        { date: '2026-07', label: 'Jul 26', customers: 1210, providers: 95, total: 1305 },
        { date: '2026-08', label: 'Aug 26', customers: 1280, providers: 102, total: 1382 },
        { date: '2026-09', label: 'Sep 26', customers: 1340, providers: 110, total: 1450 },
      ],
    };
  }

  // Default '30d'
  return {
    summary: {
      totalUsers: 12450,
      newCustomers: 1240,
      newProviders: 95,
      growthRate: 18.2,
    },
    timeline: [
      { date: '2026-09-01', label: 'Week 1', customers: 280, providers: 22, total: 302 },
      { date: '2026-09-08', label: 'Week 2', customers: 310, providers: 24, total: 334 },
      { date: '2026-09-15', label: 'Week 3', customers: 325, providers: 26, total: 351 },
      { date: '2026-09-22', label: 'Week 4', customers: 325, providers: 23, total: 348 },
    ],
  };
};

export const getMockBookingTrends = (range: AnalyticsDateRange): BookingTrendsReport => {
  if (range === '7d') {
    return {
      summary: {
        totalBookings: 680,
        completedBookings: 615,
        cancelledBookings: 25,
        completionRate: 90.4,
      },
      timeline: [
        { date: '2026-09-15', label: 'Mon', completed: 85, active: 10, cancelled: 3, total: 98 },
        { date: '2026-09-16', label: 'Tue', completed: 90, active: 8, cancelled: 4, total: 102 },
        { date: '2026-09-17', label: 'Wed', completed: 88, active: 12, cancelled: 2, total: 102 },
        { date: '2026-09-18', label: 'Thu', completed: 94, active: 9, cancelled: 5, total: 108 },
        { date: '2026-09-19', label: 'Fri', completed: 102, active: 15, cancelled: 4, total: 121 },
        { date: '2026-09-20', label: 'Sat', completed: 78, active: 6, cancelled: 3, total: 87 },
        { date: '2026-09-21', label: 'Sun', completed: 78, active: 8, cancelled: 4, total: 90 },
      ],
    };
  }

  // 30d / Default
  return {
    summary: {
      totalBookings: 2840,
      completedBookings: 2580,
      cancelledBookings: 110,
      completionRate: 90.8,
    },
    timeline: [
      { date: '2026-09-01', label: 'Week 1', completed: 620, active: 40, cancelled: 25, total: 685 },
      { date: '2026-09-08', label: 'Week 2', completed: 645, active: 45, cancelled: 28, total: 718 },
      { date: '2026-09-15', label: 'Week 3', completed: 660, active: 50, cancelled: 30, total: 740 },
      { date: '2026-09-22', label: 'Week 4', completed: 655, active: 42, cancelled: 27, total: 724 },
    ],
  };
};

export const getMockRevenuePerformance = (range: AnalyticsDateRange): RevenuePerformanceReport => {
  if (range === '7d') {
    return {
      summary: {
        grossRevenue: 11850,
        totalCommission: 1777.5,
        totalPayouts: 10072.5,
        currency: 'EUR',
      },
      timeline: [
        { date: '2026-09-15', label: 'Mon', grossRevenue: 1650, commission: 247.5, payouts: 1402.5 },
        { date: '2026-09-16', label: 'Tue', grossRevenue: 1720, commission: 258.0, payouts: 1462.0 },
        { date: '2026-09-17', label: 'Wed', grossRevenue: 1680, commission: 252.0, payouts: 1428.0 },
        { date: '2026-09-18', label: 'Thu', grossRevenue: 1840, commission: 276.0, payouts: 1564.0 },
        { date: '2026-09-19', label: 'Fri', grossRevenue: 1950, commission: 292.5, payouts: 1657.5 },
        { date: '2026-09-20', label: 'Sat', grossRevenue: 1510, commission: 226.5, payouts: 1283.5 },
        { date: '2026-09-21', label: 'Sun', grossRevenue: 1500, commission: 225.0, payouts: 1275.0 },
      ],
    };
  }

  // 30d / Default
  return {
    summary: {
      grossRevenue: 48320,
      totalCommission: 7248,
      totalPayouts: 41072,
      currency: 'EUR',
    },
    timeline: [
      { date: '2026-09-01', label: 'Week 1', grossRevenue: 11400, commission: 1710, payouts: 9690 },
      { date: '2026-09-08', label: 'Week 2', grossRevenue: 12100, commission: 1815, payouts: 10285 },
      { date: '2026-09-15', label: 'Week 3', grossRevenue: 12500, commission: 1875, payouts: 10625 },
      { date: '2026-09-22', label: 'Week 4', grossRevenue: 12320, commission: 1848, payouts: 10472 },
    ],
  };
};

export const getMockProviderPerformance = (): ProviderPerformanceReport => {
  return {
    summary: {
      totalActiveProviders: 340,
      averageCompletionRate: 94.2,
      topCategory: 'Plumbing & Drainage',
    },
    providers: [
      {
        id: 'prov-001',
        name: 'Michael Dubois',
        email: 'michael.dubois@example.com',
        category: 'Plumbing & Drainage',
        totalBookings: 142,
        completedBookings: 138,
        cancelledBookings: 4,
        completionRate: 97.2,
        grossRevenue: 12450,
        status: 'active',
      },
      {
        id: 'prov-002',
        name: 'Claire Moreau',
        email: 'claire.moreau@example.com',
        category: 'Home Cleaning',
        totalBookings: 128,
        completedBookings: 122,
        cancelledBookings: 6,
        completionRate: 95.3,
        grossRevenue: 8960,
        status: 'active',
      },
      {
        id: 'prov-003',
        name: 'Alex Fontana',
        email: 'alex.fontana@example.com',
        category: 'Electrical Diagnostics',
        totalBookings: 115,
        completedBookings: 108,
        cancelledBookings: 7,
        completionRate: 93.9,
        grossRevenue: 10320,
        status: 'active',
      },
      {
        id: 'prov-004',
        name: 'Tom Roux',
        email: 'tom.roux@example.com',
        category: 'Gardening & Landscaping',
        totalBookings: 98,
        completedBookings: 92,
        cancelledBookings: 6,
        completionRate: 93.8,
        grossRevenue: 7420,
        status: 'active',
      },
      {
        id: 'prov-005',
        name: 'Sophie Laurent',
        email: 'sophie.laurent@example.com',
        category: 'Painting & Decorating',
        totalBookings: 84,
        completedBookings: 79,
        cancelledBookings: 5,
        completionRate: 94.0,
        grossRevenue: 6850,
        status: 'active',
      },
    ],
  };
};

export const getMockPlatformEngagement = (range: AnalyticsDateRange): PlatformEngagementReport => {
  const isShort = range === '7d';
  return {
    summary: {
      monthlyActiveUsers: isShort ? 3200 : 9840,
      repeatBookingRate: 42.5,
      averageJobsPerUser: 2.3,
    },
    timeline: isShort
      ? [
          { date: '2026-09-15', label: 'Mon', activeUsers: 460, completedMissions: 85, repeatBookings: 35 },
          { date: '2026-09-16', label: 'Tue', activeUsers: 480, completedMissions: 90, repeatBookings: 38 },
          { date: '2026-09-17', label: 'Wed', activeUsers: 510, completedMissions: 88, repeatBookings: 40 },
          { date: '2026-09-18', label: 'Thu', activeUsers: 530, completedMissions: 94, repeatBookings: 42 },
          { date: '2026-09-19', label: 'Fri', activeUsers: 590, completedMissions: 102, repeatBookings: 48 },
          { date: '2026-09-20', label: 'Sat', activeUsers: 420, completedMissions: 78, repeatBookings: 30 },
          { date: '2026-09-21', label: 'Sun', activeUsers: 440, completedMissions: 78, repeatBookings: 32 },
        ]
      : [
          { date: '2026-09-01', label: 'Week 1', activeUsers: 2400, completedMissions: 620, repeatBookings: 260 },
          { date: '2026-09-08', label: 'Week 2', activeUsers: 2550, completedMissions: 645, repeatBookings: 275 },
          { date: '2026-09-15', label: 'Week 3', activeUsers: 2620, completedMissions: 660, repeatBookings: 285 },
          { date: '2026-09-22', label: 'Week 4', activeUsers: 2580, completedMissions: 655, repeatBookings: 280 },
        ],
  };
};
