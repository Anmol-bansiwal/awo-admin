export type AnnouncementAudience = 'ALL' | 'CUSTOMERS' | 'PROVIDERS';
export type AnnouncementStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience: AnnouncementAudience;
  status: AnnouncementStatus;
  created_at: string;
  updated_at: string;
  author?: string;
}

export interface AnnouncementListResponse {
  data: Announcement[];
  metadata: {
    page: number;
    page_size: number;
    total: number;
  };
}

export interface CreateAnnouncementPayload {
  title: string;
  message: string;
  target_audience: AnnouncementAudience;
  status?: AnnouncementStatus;
}

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>;

export interface NotificationChannelToggle {
  id: string;
  label: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  in_app: boolean;
}

export interface NotificationGroup {
  id: string;
  category: string;
  description: string;
  items: NotificationChannelToggle[];
}

export interface NotificationSettingsResponse {
  groups: NotificationGroup[];
}

export type UpdateNotificationSettingsPayload = NotificationSettingsResponse;

export type PolicySlug =
  | 'terms-of-service'
  | 'privacy-policy'
  | 'cancellation-policy'
  | 'refund-policy'
  | 'about-us';

export interface PolicyContent {
  id: string;
  slug: PolicySlug;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  updated_at: string;
  updated_by?: string;
}

export interface UpdatePolicyPayload {
  title: string;
  content: string;
  version?: string;
  is_active?: boolean;
}

// --- Service Categories ---
export interface Category {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  is_active: boolean;
}

export interface UpdateCategoryPayload {
  name: string;
  sort_order?: number;
}

export interface CategoriesListResponse {
  data: Category[];
}

export interface CategoryDetailsResponse {
  data: Category;
}

