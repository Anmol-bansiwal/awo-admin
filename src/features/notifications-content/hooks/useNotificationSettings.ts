import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsContentApi } from '../notifications-content.api';
import { MOCK_NOTIFICATION_GROUPS } from '../mock/notifications-content.mock';
import type {
  NotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
} from '../notifications-content.types';

export const NOTIFICATION_SETTINGS_QUERY_KEY = ['notification-settings'];

export const useNotificationSettingsQuery = () => {
  return useQuery({
    queryKey: NOTIFICATION_SETTINGS_QUERY_KEY,
    queryFn: async (): Promise<NotificationSettingsResponse> => {
      try {
        const res = await notificationsContentApi.getNotificationSettings();
        if (res && res.groups && res.groups.length > 0) return res;
      } catch (e) {
        // Fallback to local mock data
      }
      return { groups: JSON.parse(JSON.stringify(MOCK_NOTIFICATION_GROUPS)) };
    },
    staleTime: 60000,
  });
};

export const useUpdateNotificationSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateNotificationSettingsPayload) => {
      try {
        return await notificationsContentApi.updateNotificationSettings(payload);
      } catch (e) {
        // Mock fallback update
        MOCK_NOTIFICATION_GROUPS.length = 0;
        MOCK_NOTIFICATION_GROUPS.push(...payload.groups);
        return { groups: payload.groups };
      }
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(NOTIFICATION_SETTINGS_QUERY_KEY, updatedData);
    },
  });
};
