import { formatMoney } from '../../finance/utils/financeFormatters';
import { formatDateTime } from '../../../utils/formatters';
import type { CaseStatus, CasePriority, ComplaintType } from '../complaints.types';

export { formatMoney };

export const formatComplaintDate = formatDateTime;

export const formatCaseStatus = (status?: CaseStatus | string | null): string => {
  if (!status) return 'Unknown';
  switch (status.toUpperCase()) {
    case 'OPEN':
      return 'Open';
    case 'UNDER_REVIEW':
      return 'Under Review';
    case 'RESOLVED':
      return 'Resolved';
    case 'REJECTED':
      return 'Rejected';
    case 'ESCALATED':
      return 'Escalated';
    default:
      return status
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
  }
};

export const formatCasePriority = (priority?: CasePriority | string | null): string => {
  if (!priority) return 'Medium';
  switch (priority.toUpperCase()) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    case 'CRITICAL':
      return 'Critical';
    default:
      return priority;
  }
};

export const formatComplaintType = (type?: ComplaintType | string | null): string => {
  if (!type) return 'Complaint';
  switch (type.toUpperCase()) {
    case 'CUSTOMER_COMPLAINT':
      return 'Customer Complaint';
    case 'PROVIDER_DISPUTE':
      return 'Provider Dispute';
    case 'REFUND_REQUEST':
      return 'Refund Request';
    case 'ESCALATION':
      return 'Escalation Case';
    default:
      return type
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
  }
};

export function filterAndPaginateMockCases<T extends { 
  status?: string; 
  priority?: string; 
  case_number: string; 
  subject: string; 
  category?: string; 
  booking_code?: string; 
  customer?: { name?: string; full_name?: string; email?: string }; 
  provider?: { name?: string; full_name?: string }; 
  description?: string; 
  refund_reason?: string; 
  escalation_reason?: string; 
}>(
  items: T[],
  page = 1,
  pageSize = 20,
  filters?: { status?: string; search?: string; priority?: string }
) {
  let filtered = [...items];
  const { status, search, priority } = filters || {};

  if (status && status !== 'all') {
    filtered = filtered.filter((i) => (i.status || '').toLowerCase() === status.toLowerCase());
  }
  if (priority && priority !== 'all') {
    filtered = filtered.filter((i) => (i.priority || '').toLowerCase() === priority.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (i) =>
        i.case_number.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q) ||
        (i.booking_code || '').toLowerCase().includes(q) ||
        (i.customer?.name || '').toLowerCase().includes(q) ||
        (i.customer?.full_name || '').toLowerCase().includes(q) ||
        (i.customer?.email || '').toLowerCase().includes(q) ||
        (i.provider?.name || '').toLowerCase().includes(q) ||
        (i.provider?.full_name || '').toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q) ||
        (i.refund_reason || '').toLowerCase().includes(q) ||
        (i.escalation_reason || '').toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  return {
    data: filtered.slice(startIndex, startIndex + pageSize),
    metadata: { total, page, page_size: pageSize },
  };
}
