import { Eye, MessageSquareWarning, Scale, RotateCcw, Flame } from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import type {
  ComplaintCase,
  CustomerComplaint,
  ProviderDispute,
  RefundRequestCase,
  EscalationCase,
} from '../complaints.types';
import { ComplaintStatus, CasePriorityBadge } from './ComplaintStatus';
import { formatComplaintDate, formatMoney, formatComplaintType } from '../utils/complaintsFormatters';

export type CaseTableMode = 'complaints' | 'disputes' | 'refund-requests' | 'escalations';

export interface CaseTableProps<T extends ComplaintCase = ComplaintCase> {
  mode: CaseTableMode;
  items: T[];
  onViewDetails: (item: T) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}

export function CaseTable<T extends ComplaintCase>({
  mode,
  items,
  onViewDetails,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  pagination,
}: CaseTableProps<T>) {
  const getModeConfig = () => {
    switch (mode) {
      case 'complaints':
        return {
          itemName: 'complaints',
          emptyTitle: 'No customer complaints found',
          emptyMessage: 'There are no complaint cases matching the selected criteria.',
          icon: <MessageSquareWarning className="w-4 h-4" />,
          emptyIcon: <MessageSquareWarning className="w-7 h-7" />,
          iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40',
        };
      case 'disputes':
        return {
          itemName: 'disputes',
          emptyTitle: 'No provider disputes found',
          emptyMessage: 'There are no active provider disputes matching your search.',
          icon: <Scale className="w-4 h-4" />,
          emptyIcon: <Scale className="w-7 h-7" />,
          iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
        };
      case 'refund-requests':
        return {
          itemName: 'refund requests',
          emptyTitle: 'No refund requests found',
          emptyMessage: 'There are no complaint refund requests matching the current criteria.',
          icon: <RotateCcw className="w-4 h-4" />,
          emptyIcon: <RotateCcw className="w-7 h-7" />,
          iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40',
        };
      case 'escalations':
        return {
          itemName: 'escalation cases',
          emptyTitle: 'No escalation cases found',
          emptyMessage: 'There are currently no high-priority escalation cases requiring intervention.',
          icon: <Flame className="w-4 h-4" />,
          emptyIcon: <Flame className="w-7 h-7" />,
          iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/40',
        };
    }
  };

  const config = getModeConfig();

  const columns: ColumnDef<T>[] = [
    {
      key: 'case_number',
      header: mode === 'disputes' ? 'Dispute ID' : mode === 'refund-requests' ? 'Request ID' : mode === 'escalations' ? 'Escalation ID' : 'Case ID',
      render: (item) => (
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${config.iconBg}`}>
            {config.icon}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 dark:text-white font-mono block truncate group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 transition-colors">
              {item.case_number}
            </span>
            {item.category ? (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                {item.category}
              </span>
            ) : item.type === 'ESCALATION' && (item as any).source_type ? (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                Origin: {formatComplaintType((item as any).source_type)}
              </span>
            ) : null}
          </div>
        </div>
      ),
    },
  ];

  if (mode === 'disputes') {
    columns.push(
      {
        key: 'provider',
        header: 'Provider',
        render: (item) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block truncate">
              {item.provider?.full_name || item.provider?.name || (item.provider_id ? `Provider #${item.provider_id.slice(0, 8)}` : '—')}
            </span>
            {item.provider?.email && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                {item.provider.email}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'customer',
        header: 'Customer',
        render: (item) => (
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
              {item.customer?.full_name || item.customer?.name || (item.customer_id ? `Customer #${item.customer_id.slice(0, 8)}` : '—')}
            </span>
            {item.customer?.email && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                {item.customer.email}
              </span>
            )}
          </div>
        ),
      }
    );
  } else if (mode === 'escalations') {
    columns.push({
      key: 'participants',
      header: 'Customer / Provider',
      render: (item) => {
        const customerName = item.customer?.full_name || item.customer?.name;
        const providerName = item.provider?.full_name || item.provider?.name;
        return (
          <div className="space-y-0.5">
            {customerName && (
              <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                Cust: {customerName}
              </span>
            )}
            {providerName && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                Prov: {providerName}
              </span>
            )}
            {!customerName && !providerName && <span className="text-slate-400 text-xs">—</span>}
          </div>
        );
      },
    });
  } else {
    columns.push({
      key: 'customer',
      header: 'Customer',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white block truncate">
            {item.customer?.full_name || item.customer?.name || (item.customer_id ? `Customer #${item.customer_id.slice(0, 8)}` : '—')}
          </span>
          {item.customer?.email && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
              {item.customer.email}
            </span>
          )}
        </div>
      ),
    });
  }

  columns.push({
    key: 'booking',
    header: 'Booking',
    render: (item) => (
      <div>
        <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
          {item.booking_code || (item.booking_id ? `#${item.booking_id.slice(0, 8)}` : '—')}
        </span>
        {item.service_title && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block max-w-[170px]">
            {item.service_title}
          </span>
        )}
      </div>
    ),
  });

  if (mode === 'disputes') {
    columns.push({
      key: 'amount',
      header: 'Amount',
      render: (item) => (
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          {formatMoney(item.disputed_amount, item.currency)}
        </span>
      ),
    });
  } else if (mode === 'refund-requests') {
    columns.push({
      key: 'amount',
      header: 'Requested Amount',
      render: (item) => (
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          {formatMoney(item.requested_refund_amount ?? item.disputed_amount, item.currency)}
        </span>
      ),
    });
  }

  columns.push({
    key: 'subject',
    header: mode === 'refund-requests' ? 'Reason / Claim' : mode === 'disputes' ? 'Dispute Summary' : 'Subject',
    render: (item) => {
      const mainText = (item as any).refund_reason || item.subject;
      const subText = (item as any).escalation_reason ? `Reason: ${(item as any).escalation_reason}` : item.description;
      return (
        <div className="max-w-[220px]">
          <span className="font-medium text-slate-800 dark:text-slate-200 text-xs block truncate" title={mainText}>
            {mainText}
          </span>
          <span className={`text-[11px] block truncate ${(item as any).escalation_reason ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} title={subText}>
            {subText}
          </span>
        </div>
      );
    },
  });

  if (mode === 'complaints' || mode === 'escalations') {
    columns.push({
      key: 'priority',
      header: 'Priority',
      render: (item) => <CasePriorityBadge priority={item.priority} />,
    });
  }

  columns.push(
    {
      key: 'status',
      header: 'Status',
      render: (item) => <ComplaintStatus status={item.status} />,
    },
    {
      key: 'created_at',
      header: mode === 'refund-requests' ? 'Requested Date' : mode === 'escalations' ? 'Escalated Date' : 'Date',
      className: 'whitespace-nowrap text-slate-500 dark:text-slate-400',
      render: (item) => formatComplaintDate(item.created_at),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(item);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#006E1C] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
          title="Review Case"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }
  );

  return (
    <DataTable<T>
      data={items}
      columns={columns}
      keyExtractor={(item) => item.id}
      onRowClick={onViewDetails}
      isLoading={isLoading}
      loadingMessage={`Loading ${config.itemName}...`}
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle={config.emptyTitle}
      emptyMessage={config.emptyMessage}
      emptyIcon={config.emptyIcon}
      pagination={
        pagination
          ? {
            ...pagination,
            itemName: config.itemName,
          }
          : undefined
      }
    />
  );
}

export const ComplaintTable = (props: Omit<CaseTableProps<CustomerComplaint>, 'mode' | 'items'> & { complaints: CustomerComplaint[] }) => (
  <CaseTable<CustomerComplaint> {...props} mode="complaints" items={props.complaints} />
);

export const DisputeTable = (props: Omit<CaseTableProps<ProviderDispute>, 'mode' | 'items'> & { disputes: ProviderDispute[] }) => (
  <CaseTable<ProviderDispute> {...props} mode="disputes" items={props.disputes} />
);

export const RefundRequestTable = (props: Omit<CaseTableProps<RefundRequestCase>, 'mode' | 'items'> & { refundRequests: RefundRequestCase[] }) => (
  <CaseTable<RefundRequestCase> {...props} mode="refund-requests" items={props.refundRequests} />
);

export const EscalationTable = (props: Omit<CaseTableProps<EscalationCase>, 'mode' | 'items'> & { escalations: EscalationCase[] }) => (
  <CaseTable<EscalationCase> {...props} mode="escalations" items={props.escalations} />
);
