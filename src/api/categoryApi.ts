import { apiFetch } from './apiUtils';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoriesListResponse,
  CategoryDetailsResponse,
} from '../features/notifications-content/notifications-content.types';

export const categoryApi = {
  list: async (): Promise<Category[]> => {
    const res = await apiFetch<CategoriesListResponse | Category[]>('/api/v1/admin/categories', {
      method: 'GET',
    });
    if (Array.isArray(res)) return res;
    return res.data || [];
  },

  getById: async (id: string): Promise<Category> => {
    const res = await apiFetch<CategoryDetailsResponse | Category>(`/api/v1/admin/categories/${id}`, {
      method: 'GET',
    });
    if ('data' in res && res.data) return res.data;
    return res as Category;
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const res = await apiFetch<CategoryDetailsResponse | Category>('/api/v1/admin/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if ('data' in res && res.data) return res.data;
    return res as Category;
  },

  update: async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
    const res = await apiFetch<CategoryDetailsResponse | Category>(`/api/v1/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if ('data' in res && res.data) return res.data;
    return res as Category;
  },

  updateIcon: async (id: string, file: File): Promise<Category> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiFetch<CategoryDetailsResponse | Category>(
      `/api/v1/admin/categories/${id}/icon`,
      {
        method: 'POST',
        body: formData,
      }
    );
    if ('data' in res && res.data) return res.data;
    return res as Category;
  },

  deactivate: async (id: string): Promise<Category> => {
    const res = await apiFetch<CategoryDetailsResponse | Category>(
      `/api/v1/admin/categories/${id}/deactivate`,
      {
        method: 'POST',
      }
    );
    if ('data' in res && res.data) return res.data;
    return res as Category;
  },

  activate: async (id: string): Promise<Category> => {
    const res = await apiFetch<CategoryDetailsResponse | Category>(
      `/api/v1/admin/categories/${id}/activate`,
      {
        method: 'POST',
      }
    );
    if ('data' in res && res.data) return res.data;
    return res as Category;
  },
};

export const categoryService = categoryApi;
