import React from 'react';
import {
  AlertCircle,
  Calendar,
  User,
  UserCheck,
  Tag,
  FileText,
  DollarSign,
  CheckCircle2,
  Phone,
  Mail,
  Flame,
  X,
} from 'lucide-react';
import { DetailsDrawer } from '../../../components/DetailsDrawer';
import { ComplaintStatus, CasePriorityBadge } from './ComplaintStatus';
import {
  formatMoney,
  formatComplaintDate,
  formatComplaintType,
} from '../utils/complaintsFormatters';
import type { ComplaintCase } from '../complaints.types';

interface CaseDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: ComplaintCase | null;
  title?: string;
  subtitle?: string;
  onApproveRefund?: (caseItem: ComplaintCase) => void;
  onRejectRefund?: (caseItem: ComplaintCase) => void;
  isActionLoading?: boolean;
}

export const CaseDetailsDrawer: React.FC<CaseDetailsDrawerProps> = ({
  isOpen,
  onClose,
  caseItem,
  title = 'Case Details',
  subtitle = 'Complaint & dispute audit record',
  onApproveRefund,
  onRejectRefund,
  isActionLoading = false,
}) => {
  const canTakeAction =
    Boolean(onApproveRefund || onRejectRefund) &&
    caseItem &&
    (caseItem.status === 'OPEN' || caseItem.status === 'UNDER_REVIEW');

  const actionFooter = canTakeAction ? (
    <div className="flex items-center justify-end gap-3 w-full">
      {onRejectRefund && (
        <button
          type="button"
          onClick={() => onRejectRefund(caseItem!)}
          disabled={isActionLoading}
          className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          <span>Reject Claim</span>
        </button>
      )}
      {onApproveRefund && (
        <button
          type="button"
          onClick={() => onApproveRefund(caseItem!)}
          disabled={isActionLoading}
          className="px-4 py-2.5 rounded-xl bg-[#006E1C] hover:bg-[#005716] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approve Refund</span>
        </button>
      )}
    </div>
  ) : undefined;

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={
        <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/40 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
      }
      maxWidthClassName="max-w-xl"
      footer={actionFooter}
    >
      {caseItem && (
        <div className="space-y-6">
          <DetailsDrawer.Hero
            label={caseItem.case_number}
            value={caseItem.subject}
            badge={
              <div className="flex items-center gap-2">
                <ComplaintStatus status={caseItem.status} size="md" />
                <CasePriorityBadge priority={caseItem.priority} size="md" />
              </div>
            }
          />

          <DetailsDrawer.Section title="Case Information">
            <DetailsDrawer.Row
              icon={Tag}
              label="Case Number"
              value={caseItem.case_number}
              mono
            />
            <DetailsDrawer.Row
              icon={AlertCircle}
              label="Case Type"
              value={formatComplaintType(caseItem.type)}
            />
            {caseItem.category && (
              <DetailsDrawer.Row
                icon={FileText}
                label="Category"
                value={caseItem.category}
              />
            )}
            <DetailsDrawer.Row
              icon={Calendar}
              label="Created At"
              value={formatComplaintDate(caseItem.created_at)}
            />
            {caseItem.updated_at && (
              <DetailsDrawer.Row
                icon={Calendar}
                label="Last Updated"
                value={formatComplaintDate(caseItem.updated_at)}
              />
            )}
          </DetailsDrawer.Section>

          {(caseItem.customer || caseItem.provider) && (
            <DetailsDrawer.Section title="Participants Involved">
              {caseItem.customer && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>Customer Details</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {caseItem.customer.full_name || caseItem.customer.name || 'Unnamed Customer'}
                  </div>
                  {caseItem.customer.email && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>{caseItem.customer.email}</span>
                    </div>
                  )}
                  {caseItem.customer.phone && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{caseItem.customer.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {caseItem.provider && (
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>Provider Details</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {caseItem.provider.full_name || caseItem.provider.name || 'Unnamed Provider'}
                  </div>
                  {caseItem.provider.email && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>{caseItem.provider.email}</span>
                    </div>
                  )}
                  {caseItem.provider.phone && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{caseItem.provider.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </DetailsDrawer.Section>
          )}

          {(caseItem.booking_code || caseItem.disputed_amount !== undefined || caseItem.requested_refund_amount !== undefined) && (
            <DetailsDrawer.Section title="Booking & Financial Information">
              {caseItem.booking_code && (
                <DetailsDrawer.Row
                  icon={FileText}
                  label="Booking Reference"
                  value={caseItem.booking_code}
                  mono
                />
              )}
              {caseItem.service_title && (
                <DetailsDrawer.Row
                  icon={Tag}
                  label="Service Booked"
                  value={caseItem.service_title}
                />
              )}
              {caseItem.disputed_amount !== undefined && (
                <DetailsDrawer.Row
                  icon={DollarSign}
                  label="Disputed Amount"
                  value={formatMoney(caseItem.disputed_amount, caseItem.currency)}
                />
              )}
              {caseItem.requested_refund_amount !== undefined && (
                <DetailsDrawer.Row
                  icon={DollarSign}
                  label="Refund Requested"
                  value={formatMoney(caseItem.requested_refund_amount, caseItem.currency)}
                />
              )}
            </DetailsDrawer.Section>
          )}

          {caseItem.description && (
            <DetailsDrawer.Section title="Case Statement & Details">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Description / Statement
                </span>
                <p>{caseItem.description}</p>
              </div>
            </DetailsDrawer.Section>
          )}

          {(caseItem.status === 'ESCALATED' || caseItem.escalation_reason || caseItem.type === 'ESCALATION') && (
            <DetailsDrawer.Section title="Escalation Details">
              <DetailsDrawer.Callout
                variant="danger"
                icon={<Flame className="w-4 h-4 text-rose-500" />}
                title="Escalation Trigger"
                footer={
                  <>
                    {caseItem.escalated_by && <span>Escalated by: {caseItem.escalated_by}</span>}
                    {caseItem.escalated_at && <span>At: {formatComplaintDate(caseItem.escalated_at)}</span>}
                  </>
                }
              >
                {caseItem.escalation_reason && <p>{caseItem.escalation_reason}</p>}
              </DetailsDrawer.Callout>
            </DetailsDrawer.Section>
          )}

          {(caseItem.status === 'RESOLVED' || caseItem.resolution_notes) && (
            <DetailsDrawer.Section title="Resolution & Settlement">
              <DetailsDrawer.Callout
                variant="success"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                title="Resolution Outcome"
                footer={
                  <>
                    {caseItem.resolved_by && <span>Resolved by: {caseItem.resolved_by}</span>}
                    {caseItem.resolved_at && <span>At: {formatComplaintDate(caseItem.resolved_at)}</span>}
                  </>
                }
              >
                {caseItem.resolution_notes && <p>{caseItem.resolution_notes}</p>}
              </DetailsDrawer.Callout>
            </DetailsDrawer.Section>
          )}
        </div>
      )}
    </DetailsDrawer>
  );
};
