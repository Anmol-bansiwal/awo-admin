import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsContentApi } from '../notifications-content.api';
import { MOCK_POLICIES } from '../mock/notifications-content.mock';
import type {
  PolicyContent,
  PolicySlug,
  UpdatePolicyPayload,
} from '../notifications-content.types';

export const POLICIES_QUERY_KEY = ['policies-content'];

export const usePoliciesContentQuery = () => {
  return useQuery({
    queryKey: POLICIES_QUERY_KEY,
    queryFn: async (): Promise<PolicyContent[]> => {
      try {
        const res = await notificationsContentApi.getPolicies();
        if (Array.isArray(res) && res.length > 0) return res;
      } catch (e) {
        // Fallback to local mock data
      }
      return Object.values(MOCK_POLICIES);
    },
    staleTime: 60000,
  });
};

export const usePolicyDetailsQuery = (slug: PolicySlug) => {
  return useQuery({
    queryKey: [...POLICIES_QUERY_KEY, slug],
    queryFn: async (): Promise<PolicyContent> => {
      try {
        const res = await notificationsContentApi.getPolicyBySlug(slug);
        if (res && res.content) return res;
      } catch (e) {
        // Fallback to local mock data
      }
      const found = MOCK_POLICIES[slug];
      if (found) return JSON.parse(JSON.stringify(found));
      throw new Error(`Policy not found: ${slug}`);
    },
    staleTime: 60000,
  });
};

export const useUpdatePolicyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug,
      payload,
    }: {
      slug: PolicySlug;
      payload: UpdatePolicyPayload;
    }) => {
      try {
        return await notificationsContentApi.updatePolicy(slug, payload);
      } catch (e) {
        // Mock fallback update
        if (MOCK_POLICIES[slug]) {
          MOCK_POLICIES[slug] = {
            ...MOCK_POLICIES[slug],
            ...payload,
            updated_at: new Date().toISOString(),
          };
          return MOCK_POLICIES[slug];
        }
        throw new Error(`Policy not found: ${slug}`);
      }
    },
    onSuccess: (updatedPolicy, { slug }) => {
      queryClient.setQueryData([...POLICIES_QUERY_KEY, slug], updatedPolicy);
      queryClient.invalidateQueries({ queryKey: POLICIES_QUERY_KEY });
    },
  });
};
