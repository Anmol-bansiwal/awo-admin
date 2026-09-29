import React from 'react';
import { Users } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import { SearchBar } from '../../../components/SearchBar';
import { ProviderStatusBadge, ProviderKycStatusBadge } from './ProviderStatus';
import { ProviderActions } from './ProviderActions';
import type { Provider } from '../providers.types';

export interface ProviderTableProps {
  providers: Provider[];
  totalProviders: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onUserClick?: (provider: Provider) => void;
  onOpenSuspendModal: (provider: Provider) => void;
  onOpenReactivateModal: (provider: Provider) => void;
  onOpenKycModal: (provider: Provider) => void;
  onViewDetails?: (provider: Provider) => void;
}

export const ProviderTable: React.FC<ProviderTableProps> = ({
  providers,
  totalProviders,
  currentPage,
  pageSize,
  onPageChange,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search providers...',
  emptyMessage = 'No providers found.',
  onUserClick,
  onOpenSuspendModal,
  onOpenReactivateModal,
  onOpenKycModal,
  onViewDetails,
}) => {
  const handleItemClick = onViewDetails || onUserClick;

  const columns: ColumnDef<Provider>[] = [
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
            onClick={() => handleItemClick?.(item)}
            disabled={!handleItemClick}
            className={`flex items-center space-x-3 text-left w-full ${handleItemClick ? 'cursor-pointer group hover:opacity-90' : 'cursor-default'
              }`}
          >
            <img
              src={item.avatar_url || fallbackAvatar}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
              }}
              alt={item.full_name || 'User'}
              className={`w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 ${handleItemClick
                ? 'group-hover:ring-2 group-hover:ring-[#006E1C]/40 dark:group-hover:ring-emerald-500/40 transition-all'
                : ''
                }`}
            />
            <div className="flex flex-col min-w-0">
              <span
                className={`font-bold text-slate-900 dark:text-white truncate text-sm ${handleItemClick
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
      key: 'account_status',
      header: 'Account Status',
      render: (item) => <ProviderStatusBadge status={item.status} />,
    },
    {
      key: 'kyc_status',
      header: 'KYC Status',
      render: (item) => (
        <ProviderKycStatusBadge kycStatus={item.kyc_status ?? item.provider?.kyc_status} />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <ProviderActions
          provider={item}
          onOpenSuspendModal={onOpenSuspendModal}
          onOpenReactivateModal={onOpenReactivateModal}
          onOpenKycModal={onOpenKycModal}
          onViewDetails={handleItemClick}
        />
      ),
    },
  ];

  const headerControl = (
    <div className="flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="w-full sm:w-80">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
    </div>
  );

  return (
    <DataTable<Provider>
      data={providers}
      columns={columns}
      keyExtractor={(item) => item.id}
      headerControl={headerControl}
      isLoading={isLoading}
      loadingMessage="Loading providers directory..."
      isError={isError}
      errorMessage={errorMessage}
      emptyTitle={emptyMessage}
      emptyMessage={
        searchQuery ? 'Try adjusting your search criteria.' : 'No providers available in this category.'
      }
      emptyIcon={<Users className="w-7 h-7 text-slate-400 dark:text-slate-500" />}
      pagination={{
        currentPage,
        pageSize,
        totalItems: totalProviders,
        onPageChange,
        itemName: 'providers',
      }}
    />
  );
};
