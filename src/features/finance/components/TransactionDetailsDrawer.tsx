import React from 'react';
import { CreditCard, Calendar, User, UserCheck, ShieldCheck, Tag, FileText } from 'lucide-react';
import { DetailsDrawer } from '../../../components/DetailsDrawer';
import { useTransactionDetailsQuery } from '../hooks/useTransactions';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate, formatTransactionType } from '../utils/financeFormatters';
import type { Transaction } from '../finance.types';

interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
  initialTransaction?: Transaction | null;
}

export const TransactionDetailsDrawer: React.FC<TransactionDetailsDrawerProps> = ({
  isOpen,
  onClose,
  transactionId,
  initialTransaction,
}) => {
  const activeId = isOpen && transactionId ? transactionId : '';
  const { data: apiTx, isLoading, isError, error } = useTransactionDetailsQuery(activeId);

  const tx = apiTx || initialTransaction;

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      subtitle="Financial ledger entry & payment record"
      icon={
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/40 shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
      }
      maxWidthClassName="max-w-xl"
      isLoading={isLoading && !tx}
      loadingMessage="Loading transaction details..."
      isError={!isLoading && isError && !tx}
      errorMessage={error instanceof Error ? error.message : 'Failed to load transaction details.'}
    >
      {tx && (
        <div className="space-y-6">
          {/* Top Amount Hero */}
          <DetailsDrawer.Hero
            label="Transaction Amount"
            value={formatMoney(tx.amount, tx.currency)}
            badge={<FinanceStatus status={tx.status} size="md" />}
          />

          {/* Payment Details Section */}
          <DetailsDrawer.Section title="Payment Details">
            <DetailsDrawer.Row
              icon={Tag}
              label="Reference / Code"
              value={tx.transaction_code || tx.reference_number || tx.id}
              mono
            />
            <DetailsDrawer.Row
              icon={CreditCard}
              label="Transaction Type"
              value={formatTransactionType(tx.type)}
            />
            {tx.payment_method && (
              <DetailsDrawer.Row
                icon={ShieldCheck}
                label="Payment Method"
                value={tx.payment_method}
              />
            )}
            {tx.booking_code && (
              <DetailsDrawer.Row
                icon={FileText}
                label="Booking Reference"
                value={tx.booking_code}
                mono
              />
            )}
            <DetailsDrawer.Row
              icon={Calendar}
              label="Timestamp"
              value={formatFinanceDate(tx.created_at)}
            />
          </DetailsDrawer.Section>

          {/* Parties Section */}
          {(tx.customer || tx.provider || tx.customer_id || tx.provider_id) && (
            <DetailsDrawer.Section title="Parties Involved">
              {(tx.customer || tx.customer_id) && (
                <DetailsDrawer.Row
                  icon={User}
                  label="Customer"
                  value={tx.customer?.full_name || tx.customer?.name || `Customer #${tx.customer_id?.slice(0, 8)}`}
                  subvalue={tx.customer?.email}
                />
              )}
              {(tx.provider || tx.provider_id) && (
                <DetailsDrawer.Row
                  icon={UserCheck}
                  label="Provider"
                  value={tx.provider?.full_name || tx.provider?.name || `Provider #${tx.provider_id?.slice(0, 8)}`}
                  subvalue={tx.provider?.email}
                />
              )}
            </DetailsDrawer.Section>
          )}

          {/* Gateway & Description Note */}
          {tx.description && (
            <DetailsDrawer.Section title="Notes & Metadata">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Description
                </span>
                <p>{tx.description}</p>
              </div>
            </DetailsDrawer.Section>
          )}
        </div>
      )}
    </DetailsDrawer>
  );
};
