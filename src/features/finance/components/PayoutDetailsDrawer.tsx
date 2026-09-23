import React from 'react';
import { ArrowUpRight, Calendar, UserCheck, Tag, CreditCard, AlertCircle } from 'lucide-react';
import { DetailsDrawer } from '../../../components/DetailsDrawer';
import { usePayoutDetailsQuery } from '../hooks/usePayouts';
import { FinanceStatus } from './FinanceStatus';
import { formatMoney, formatFinanceDate } from '../utils/financeFormatters';
import type { Payout } from '../finance.types';

interface PayoutDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payoutId: string | null;
  initialPayout?: Payout | null;
}

export const PayoutDetailsDrawer: React.FC<PayoutDetailsDrawerProps> = ({
  isOpen,
  onClose,
  payoutId,
  initialPayout,
}) => {
  const activeId = isOpen && payoutId ? payoutId : '';
  const { data: apiPayout, isLoading, isError, error } = usePayoutDetailsQuery(activeId);

  const payout = apiPayout || initialPayout;

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Provider Payout Details"
      subtitle="Earnings disbursement record & transfer state"
      icon={
        <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-800/40 shrink-0">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      }
      maxWidthClassName="max-w-xl"
      isLoading={isLoading && !payout}
      loadingMessage="Loading payout details..."
      isError={!isLoading && isError && !payout}
      errorMessage={error instanceof Error ? error.message : 'Failed to load payout details.'}
    >
      {payout && (
        <div className="space-y-6">
          {/* Top Amount Hero */}
          <DetailsDrawer.Hero
            label="Disbursed Payout"
            value={formatMoney(payout.amount, payout.currency)}
            badge={<FinanceStatus status={payout.status} size="md" />}
          />

          {/* Transfer Details Section */}
          <DetailsDrawer.Section title="Transfer Details">
            <DetailsDrawer.Row
              icon={Tag}
              label="Payout ID"
              value={payout.payout_code || payout.id}
              mono
            />
            {(payout.booking_code || payout.booking_id) && (
              <DetailsDrawer.Row
                icon={Calendar}
                label="Associated Booking"
                value={payout.booking_code || `#${payout.booking_id?.slice(0, 8)}`}
                mono
              />
            )}
            <DetailsDrawer.Row
              icon={CreditCard}
              label="Disbursement Method"
              value={payout.payout_method || 'Bank Transfer'}
            />
            {payout.bank_account_info && (
              <DetailsDrawer.Row
                icon={CreditCard}
                label="Bank Account Info"
                value={payout.bank_account_info}
                mono
              />
            )}
            <DetailsDrawer.Row
              icon={Calendar}
              label="Timestamp"
              value={formatFinanceDate(payout.processed_at || payout.requested_at || payout.created_at)}
            />
          </DetailsDrawer.Section>

          {/* Beneficiary Provider Section */}
          {(payout.provider || payout.provider_id) && (
            <DetailsDrawer.Section title="Beneficiary Details">
              <DetailsDrawer.Row
                icon={UserCheck}
                label="Provider"
                value={payout.provider?.full_name || payout.provider?.name || `Provider #${payout.provider_id?.slice(0, 8)}`}
                subvalue={payout.provider?.email}
              />
            </DetailsDrawer.Section>
          )}

          {/* Failure Reason Alert */}
          {payout.failure_reason && (
            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 space-y-1">
              <div className="flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Disbursement Failure</span>
              </div>
              <p>{payout.failure_reason}</p>
            </div>
          )}
        </div>
      )}
    </DetailsDrawer>
  );
};
