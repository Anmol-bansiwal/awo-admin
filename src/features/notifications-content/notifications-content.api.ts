import { apiFetch } from '../../api/apiUtils';
import type {
  Announcement,
  AnnouncementListResponse,
  CreateAnnouncementPayload,
  NotificationSettingsResponse,
  PolicyContent,
  PolicySlug,
  UpdateAnnouncementPayload,
  UpdateNotificationSettingsPayload,
  UpdatePolicyPayload,
} from './notifications-content.types';

export const notificationsContentApi = {
  // --- Announcements ---
  getAnnouncements: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string,
    audience?: string
  ): Promise<AnnouncementListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());
    if (audience && audience !== 'all') params.append('target_audience', audience);

    const response = await apiFetch<AnnouncementListResponse | Announcement[]>(
      `/api/v1/admin/announcements?${params.toString()}`
    );

    if (Array.isArray(response)) {
      return {
        data: response,
        metadata: {
          page,
          page_size: pageSize,
          total: response.length,
        },
      };
    }
    return response;
  },

  createAnnouncement: async (
    payload: CreateAnnouncementPayload
  ): Promise<Announcement> => {
    return apiFetch<Announcement>('/api/v1/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateAnnouncement: async (
    id: string,
    payload: UpdateAnnouncementPayload
  ): Promise<Announcement> => {
    return apiFetch<Announcement>(`/api/v1/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteAnnouncement: async (id: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/api/v1/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  },

  // --- Notification Configuration ---
  getNotificationSettings: async (): Promise<NotificationSettingsResponse> => {
    return apiFetch<NotificationSettingsResponse>('/api/v1/admin/notification-settings');
  },

  updateNotificationSettings: async (
    payload: UpdateNotificationSettingsPayload
  ): Promise<NotificationSettingsResponse> => {
    return apiFetch<NotificationSettingsResponse>(
      '/api/v1/admin/notification-settings',
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  },

  // --- Policies & Static Content ---
  getPolicies: async (): Promise<PolicyContent[]> => {
    return apiFetch<PolicyContent[]>('/api/v1/admin/policies');
  },

  getPolicyBySlug: async (slug: PolicySlug): Promise<PolicyContent> => {
    return apiFetch<PolicyContent>(`/api/v1/admin/policies/${slug}`);
  },

  updatePolicy: async (
    slug: PolicySlug,
    payload: UpdatePolicyPayload
  ): Promise<PolicyContent> => {
    return apiFetch<PolicyContent>(`/api/v1/admin/policies/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
