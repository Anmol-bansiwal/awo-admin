import React from 'react';
import { ShieldCheck, Calendar, User, UserCheck, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import { DetailsDrawer } from '../../../components/DetailsDrawer';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate } from '../utils/financeFormatters';
import type { EscrowRecord } from '../finance.types';

interface EscrowDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: EscrowRecord | null;
}

export const EscrowDetailsDrawer: React.FC<EscrowDetailsDrawerProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Escrow Vault Details"
      subtitle="Secured customer payment holding & release status"
      icon={
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/40 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
      }
      maxWidthClassName="max-w-xl"
    >
      {record && (
        <div className="space-y-6">
          {/* Top Amount Hero */}
          <DetailsDrawer.Hero
            label="Escrow Funds Held"
            value={formatMoney(record.amount, record.currency)}
            badge={<FinanceStatus status={record.status} size="md" />}
          />

          {/* Payment Lifecycle Flow Visualizer */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-inter">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>AWO Payment Escrow Lifecycle</span>
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4 text-[#006E1C] dark:text-emerald-400 mx-auto mb-1" />
                <span className="font-bold text-slate-900 dark:text-white text-[11px] block">1. Payment In</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Locked in Escrow</span>
              </div>

              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-800/40">
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="font-bold text-slate-900 dark:text-white text-[11px] block">2. Service Done</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Provider completes</span>
              </div>

              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/80 dark:border-indigo-800/40">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                <span className="font-bold text-slate-900 dark:text-white text-[11px] block">3. Released</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Paid to Provider</span>
              </div>
            </div>
          </div>

          {/* Vault Breakdown */}
          <DetailsDrawer.Section title="Vault Details">
            <DetailsDrawer.Row
              icon={Tag}
              label="Escrow ID"
              value={record.reference || record.id}
              mono
            />
            <DetailsDrawer.Row
              icon={Calendar}
              label="Booking Reference"
              value={record.booking_code || (record.booking_id ? `#${record.booking_id.slice(0, 8)}` : '—')}
              mono
            />
            <DetailsDrawer.Row
              icon={Calendar}
              label="Held Timestamp"
              value={formatFinanceDate(record.hold_date || record.created_at)}
            />
            {record.release_date && (
              <DetailsDrawer.Row
                icon={Calendar}
                label="Release Timestamp"
                value={formatFinanceDate(record.release_date)}
              />
            )}
          </DetailsDrawer.Section>

          {/* Parties Section */}
          {(record.customer || record.provider || record.customer_id || record.provider_id) && (
            <DetailsDrawer.Section title="Authorized Parties">
              {(record.customer || record.customer_id) && (
                <DetailsDrawer.Row
                  icon={User}
                  label="Customer (Payer)"
                  value={record.customer?.full_name || record.customer?.name || `Customer #${record.customer_id?.slice(0, 8)}`}
                  subvalue={record.customer?.email}
                />
              )}
              {(record.provider || record.provider_id) && (
                <DetailsDrawer.Row
                  icon={UserCheck}
                  label="Provider (Recipient)"
                  value={record.provider?.full_name || record.provider?.name || `Provider #${record.provider_id?.slice(0, 8)}`}
                  subvalue={record.provider?.email}
                />
              )}
            </DetailsDrawer.Section>
          )}

          {/* Dispute Notice */}
          {record.status === 'disputed' && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold block mb-1">Disputed Escrow Notice</span>
              This escrow transaction is flagged under dispute review. Automatic disbursement is locked pending customer service approval.
            </div>
          )}
        </div>
      )}
    </DetailsDrawer>
  );
};
