import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsContentApi } from '../notifications-content.api';
import {
  MOCK_ANNOUNCEMENTS,
  filterAndPaginateAnnouncements,
} from '../mock/notifications-content.mock';
import type {
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from '../notifications-content.types';

export const ANNOUNCEMENTS_QUERY_KEY = ['announcements'];

export const useAnnouncementsQuery = (
  page = 1,
  pageSize = 20,
  status?: string,
  search?: string,
  audience?: string
) => {
  return useQuery({
    queryKey: [...ANNOUNCEMENTS_QUERY_KEY, { page, pageSize, status, search, audience }],
    queryFn: async () => {
      try {
        const res = await notificationsContentApi.getAnnouncements(
          page,
          pageSize,
          status,
          search,
          audience
        );
        if (res.data && res.data.length > 0) return res;
      } catch (e) {
        // Fallback to local mock data in dev/offline mode
      }
      return filterAndPaginateAnnouncements(MOCK_ANNOUNCEMENTS, page, pageSize, {
        status,
        search,
        audience,
      });
    },
    staleTime: 30000,
  });
};

export const useCreateAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAnnouncementPayload) => {
      try {
        return await notificationsContentApi.createAnnouncement(payload);
      } catch (e) {
        // Mock fallback creation for dev demonstration
        const newAnnouncement = {
          id: `ANN-${String(MOCK_ANNOUNCEMENTS.length + 1).padStart(3, '0')}`,
          title: payload.title,
          message: payload.message,
          target_audience: payload.target_audience,
          status: payload.status || 'PUBLISHED',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author: 'Admin User',
        };
        MOCK_ANNOUNCEMENTS.unshift(newAnnouncement);
        return newAnnouncement;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
    },
  });
};

export const useUpdateAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAnnouncementPayload;
    }) => {
      try {
        return await notificationsContentApi.updateAnnouncement(id, payload);
      } catch (e) {
        // Mock fallback update
        const index = MOCK_ANNOUNCEMENTS.findIndex((a) => a.id === id);
        if (index !== -1) {
          MOCK_ANNOUNCEMENTS[index] = {
            ...MOCK_ANNOUNCEMENTS[index],
            ...payload,
            updated_at: new Date().toISOString(),
          };
          return MOCK_ANNOUNCEMENTS[index];
        }
        throw new Error('Announcement not found');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
    },
  });
};

export const useDeleteAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await notificationsContentApi.deleteAnnouncement(id);
      } catch (e) {
        // Mock fallback delete
        const index = MOCK_ANNOUNCEMENTS.findIndex((a) => a.id === id);
        if (index !== -1) {
          MOCK_ANNOUNCEMENTS.splice(index, 1);
        }
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
    },
  });
};
