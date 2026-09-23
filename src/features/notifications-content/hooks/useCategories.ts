import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../../api/categoryApi';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../notifications-content.types';

export const CATEGORIES_QUERY_KEY = ['categories'];
export const getCategoryDetailQueryKey = (id: string) => ['category', id];

export const useCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoryApi.list(),
    staleTime: 30000,
  });
};

export const useCategoryDetailsQuery = (id: string) => {
  return useQuery<Category>({
    queryKey: getCategoryDetailQueryKey(id),
    queryFn: () => categoryApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoryApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      categoryApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getCategoryDetailQueryKey(variables.id) });
    },
  });
};

export const useUpdateCategoryIconMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      categoryApi.updateIcon(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getCategoryDetailQueryKey(variables.id) });
    },
  });
};

export const useDeactivateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getCategoryDetailQueryKey(id) });
    },
  });
};

export const useActivateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getCategoryDetailQueryKey(id) });
    },
  });
};
