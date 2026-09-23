import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Inbox } from 'lucide-react';
import { AwoLoader } from './AwoLoader';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  pagination?: PaginationConfig;
  headerControl?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  tableClassName?: string;
  maxHeight?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading = false,
  loadingMessage = 'Loading data...',
  isError = false,
  errorMessage,
  onRetry,
  emptyTitle = 'No data found',
  emptyMessage = 'There are no records available to display.',
  emptyIcon,
  emptyAction,
  pagination,
  headerControl,
  className = '',
  containerClassName = '',
  tableClassName = '',
  maxHeight,
}: DataTableProps<T>) {
  const totalItems = pagination?.totalItems ?? data.length;
  const currentPage = pagination?.currentPage ?? 1;
  const pageSize = pagination?.pageSize ?? (data.length || 20);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const itemName = pagination?.itemName || 'records';

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between transition-colors duration-200 w-full min-w-0 ${className}`}
    >
      {/* Optional Top Header / Search / Filter Controls */}
      {headerControl && (
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/60">
          {headerControl}
        </div>
      )}

      {/* Main Table Content / States with both X and Y scroll capability */}
      <div
        className={`overflow-auto min-h-[220px] relative w-full min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
          maxHeight ? '' : 'max-h-[620px]'
        } ${containerClassName}`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {/* Loading Overlay / State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <AwoLoader size="md" message={loadingMessage} />
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/40">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Unable to load data</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {errorMessage || 'An error occurred while fetching records from the server.'}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-4 py-2 bg-[#006E1C] hover:bg-[#005716] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && data.length === 0 && (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
              {emptyIcon || <Inbox className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{emptyTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                {emptyMessage}
              </p>
            </div>
            {emptyAction && <div className="pt-2">{emptyAction}</div>}
          </div>
        )}

        {/* Real Data Table */}
        {!isLoading && !isError && data.length > 0 && (
          <table className={`w-full text-left border-collapse min-w-max ${tableClassName}`}>
            <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shadow-2xs">
              <tr>
                {columns.map((col) => {
                  const alignClass =
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left';

                  return (
                    <th
                      key={col.key}
                      className={`py-3.5 px-6 ${alignClass} ${col.headerClassName || ''}`}
                    >
                      {col.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
              {data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    onRowClick
                      ? 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer group'
                      : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20'
                  }`}     
                >
                  {columns.map((col) => {
                    const alignClass =
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                    return (
                      <td
                        key={col.key}
                        className={`py-4 px-6 ${alignClass} ${col.className || ''}`}
                      >
                        {col.render ? col.render(item, index) : (item as any)[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && !isLoading && !isError && data.length > 0 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {Math.min(totalItems, (currentPage - 1) * pageSize + 1)}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {Math.min(totalItems, currentPage * pageSize)}
            </span>{' '}
            of <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span> {itemName}
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => pagination.onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => pagination.onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
