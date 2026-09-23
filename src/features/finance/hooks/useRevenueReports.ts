import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../finance.api';
import { MOCK_REVENUE_REPORTS } from '../data/mockFinance';

export const useRevenueReportsQuery = (
  period = 'monthly',
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['revenue-reports', { period, startDate, endDate }],
    queryFn: async () => {
      try {
        const res = await financeApi.getRevenueReports(period, startDate, endDate);
        if (res && res.periods && res.periods.length > 0) {
          return res;
        }
      } catch (e) {
        // Fallback to mock revenue report in development/mock mode
      }
      return MOCK_REVENUE_REPORTS;
    },
    staleTime: 30000,
  });
};
