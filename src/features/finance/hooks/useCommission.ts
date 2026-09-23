import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../finance.api';
import { MOCK_COMMISSION_CONFIG } from '../data/mockFinance';
import type { CommissionUpdateRequest } from '../finance.types';

export const useCommissionConfigQuery = () => {
  return useQuery({
    queryKey: ['commission-config'],
    queryFn: async () => {
      try {
        const res = await financeApi.getCommissionConfig();
        if (res) return res;
      } catch (e) {
        // Fallback to mock commission config
      }
      return MOCK_COMMISSION_CONFIG;
    },
    staleTime: 30000,
  });
};

export const useUpdateCommissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CommissionUpdateRequest) => {
      try {
        return await financeApi.updateCommissionConfig(payload);
      } catch (e) {
        // Fallback local update simulation for mock mode
        return {
          default_commission_percentage: payload.default_commission_percentage ?? 12.5,
          category_commissions: MOCK_COMMISSION_CONFIG.category_commissions,
          updated_at: new Date().toISOString(),
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-config'] });
    },
  });
};
