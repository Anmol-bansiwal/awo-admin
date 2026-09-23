import { Filter, Users } from 'lucide-react';
import type { UserListItem, UserTableProps } from './UserTable.types';
import { SearchBar } from './SearchBar';
import { DataTable, type ColumnDef } from './DataTable';

export function UserTable<T extends UserListItem>({
  items,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search users...',
  renderActions,
  renderStatus,
  emptyMessage,
  onUserClick,
  onRowClick,
}: UserTableProps<T>) {
  const columns: ColumnDef<T>[] = [
    {
      key: 'user',
      header: 'User',
      render: (item) => {
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          item.full_name || 'User'
        )}&background=006E1C&color=fff`;

        return (
          <button
            type="button"
            onClick={() => (onUserClick ? onUserClick(item) : onRowClick?.(item))}
            disabled={!onUserClick && !onRowClick}
            className={`flex items-center space-x-3 text-left w-full ${
              onUserClick || onRowClick ? 'cursor-pointer group hover:opacity-90' : 'cursor-default'
            }`}
          >
            <img
              src={item.avatar_url || fallbackAvatar}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
              }}
              alt={item.full_name || 'User'}
              className={`w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 ${
                onUserClick || onRowClick
                  ? 'group-hover:ring-2 group-hover:ring-[#006E1C]/40 dark:group-hover:ring-emerald-500/40 transition-all'
                  : ''
              }`}
            />
            <div className="flex flex-col min-w-0">
              <span
                className={`font-bold text-slate-900 dark:text-white truncate text-sm ${
                  onUserClick || onRowClick
                    ? 'group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 group-hover:underline transition-colors'
                    : ''
                }`}
              >
                {item.full_name || '—'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-normal">
                {item.email || '—'}
              </span>
            </div>
          </button>
        );
      },
    },
    {
      key: 'phone',
      header: 'Phone',
      className: 'font-mono text-slate-600 dark:text-slate-400',
      render: (item) => item.phone || '—',
    },
    {
      key: 'role',
      header: 'Role',
      render: (item) => (
        <span className="capitalize font-medium text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-[11px]">
          {item.role || 'user'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) =>
        renderStatus ? (
          renderStatus(item)
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {item.status}
          </span>
        ),
    },
  ];

  if (renderActions) {
    columns.push({
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => renderActions(item),
    });
  }

  const headerControl = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="w-full sm:w-80">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* Filter Button */}
      <button
        type="button"
        onClick={() => alert('Filter options')}
        className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
      >
        <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span>Filter</span>
      </button>
    </div>
  );

  return (
    <DataTable<T>
      data={items}
      columns={columns}
      keyExtractor={(item) => item.id}
      headerControl={headerControl}
      isLoading={isLoading}
      loadingMessage="Loading directory..."
      isError={isError}
      errorMessage={errorMessage}
      emptyTitle={emptyMessage || 'No records found.'}
      emptyMessage={
        searchQuery ? 'Try adjusting your search criteria.' : 'No items available in this category.'
      }
      emptyIcon={<Users className="w-7 h-7 text-slate-400 dark:text-slate-500" />}
      pagination={{
        currentPage,
        pageSize,
        totalItems,
        onPageChange,
        itemName: 'records',
      }}
    />
  );
}
