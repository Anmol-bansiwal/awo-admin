import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { useDisputesQuery } from '../hooks/useDisputes';
import { DisputeTable } from '../components/CaseTable';
import { CaseDetailsDrawer } from '../components/CaseDetailsDrawer';
import { CasePageHeader, CaseFilterToolbar } from '../components/CaseToolbar';
import type { ProviderDispute } from '../complaints.types';

export const Disputes: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<ProviderDispute | null>(null);

  const { data: response, isLoading, isError, error, refetch, isFetching } = useDisputesQuery(
    page,
    20,
    statusFilter,
    searchQuery
  );

  const disputes = (response?.data as ProviderDispute[]) || [];
  const total = response?.metadata?.total ?? disputes.length;

  return (
    <div className="space-y-6">
      <CasePageHeader
        icon={<Scale className="w-7 h-7 text-amber-600 dark:text-amber-400" />}
        title="Provider Disputes"
        subtitle="Review service claims, payout hold objections, and contract disagreements submitted by service providers."
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      <CaseFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(s) => { setStatusFilter(s); setPage(1); }}
        searchPlaceholder="Search by dispute ID, provider, customer, booking..."
        statusLabel="All Dispute Statuses"
      />

      <DisputeTable
        disputes={disputes}
        onViewDetails={setSelectedDispute}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        pagination={{ currentPage: page, pageSize: 20, totalItems: total, onPageChange: setPage }}
      />

      <CaseDetailsDrawer
        isOpen={Boolean(selectedDispute)}
        onClose={() => setSelectedDispute(null)}
        caseItem={selectedDispute}
        title="Dispute Details"
        subtitle="Provider contract claim & statement audit"
      />
    </div>
  );
};
