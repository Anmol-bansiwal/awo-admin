import React from 'react';
import { BarChart3 } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import type { RevenuePeriodData } from '../finance.types';
import { formatMoney } from '../utils/financeFormatters';

interface RevenueReportTableProps {
  periods: RevenuePeriodData[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export const RevenueReportTable: React.FC<RevenueReportTableProps> = ({
  periods,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}) => {
  const columns: ColumnDef<RevenuePeriodData>[] = [
    {
      key: 'period',
      header: 'Reporting Period',
      className: 'font-bold text-xs text-slate-900 dark:text-white whitespace-nowrap',
    },
    {
      key: 'gross_booking_value',
      header: 'Gross Booking Value',
      className: 'font-medium text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap',
      render: (p) => formatMoney(p.gross_booking_value, p.currency),
    },
    {
      key: 'platform_commission',
      header: 'Platform Commission',
      className: 'font-bold text-xs text-[#006E1C] dark:text-emerald-400 whitespace-nowrap',
      render: (p) => formatMoney(p.platform_commission, p.currency),
    },
    {
      key: 'provider_payouts',
      header: 'Provider Payouts',
      className: 'font-medium text-xs text-purple-700 dark:text-purple-400 whitespace-nowrap',
      render: (p) => formatMoney(p.provider_payouts, p.currency),
    },
    {
      key: 'refunds',
      header: 'Refunds Issued',
      className: 'font-medium text-xs text-rose-600 dark:text-rose-400 whitespace-nowrap',
      render: (p) => formatMoney(p.refunds, p.currency),
    },
    {
      key: 'net_revenue',
      header: 'Net Revenue',
      align: 'right',
      className: 'font-extrabold text-xs text-slate-900 dark:text-white whitespace-nowrap',
      render: (p) => formatMoney(p.net_revenue, p.currency),
    },
  ];

  return (
    <DataTable<RevenuePeriodData>
      data={periods}
      columns={columns}
      keyExtractor={(p, idx) => p.period || idx}
      isLoading={isLoading}
      loadingMessage="Compiling revenue report..."
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle="No revenue data available"
      emptyMessage="No revenue records found for the selected time horizon."
      emptyIcon={<BarChart3 className="w-7 h-7 text-emerald-500" />}
    />
  );
};
