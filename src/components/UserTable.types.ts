import React from 'react';

export interface UserListItem {
  id: string;
  role: string;
  status: string;
  full_name: string;
  phone: string;
  email: string;
  avatar_url: string | null;
  created_at?: string;
}

export interface UserTableColumn<T extends UserListItem> {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

export interface UserTableProps<T extends UserListItem> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  renderActions?: (item: T) => React.ReactNode;
  renderStatus?: (item: T) => React.ReactNode;
  columns?: UserTableColumn<T>[];
  emptyMessage?: string;
  onUserClick?: (item: T) => void;
  onRowClick?: (item: T) => void;
}
