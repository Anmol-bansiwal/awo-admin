import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { useEscalationsQuery } from '../hooks/useEscalations';
import { EscalationTable } from '../components/CaseTable';
import { CaseDetailsDrawer } from '../components/CaseDetailsDrawer';
import { CasePageHeader, CaseFilterToolbar } from '../components/CaseToolbar';
import type { EscalationCase } from '../complaints.types';

export const Escalations: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationCase | null>(null);

  const { data: response, isLoading, isError, error, refetch, isFetching } = useEscalationsQuery(
    page,
    20,
    statusFilter,
    searchQuery,
    priorityFilter
  );

  const escalations = (response?.data as EscalationCase[]) || [];
  const total = response?.metadata?.total ?? escalations.length;

  return (
    <div className="space-y-6">
      <CasePageHeader
        icon={<Flame className="w-7 h-7 text-rose-600 dark:text-rose-400" />}
        title="Escalation Cases"
        subtitle="Prioritized review of critical service failures, high-liability damages, repeated disputes, and manager interventions."
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      <CaseFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(s) => { setStatusFilter(s); setPage(1); }}
        priorityFilter={priorityFilter}
        onPriorityChange={(p) => { setPriorityFilter(p); setPage(1); }}
        searchPlaceholder="Search by escalation ID, customer, provider, reason..."
      />

      <EscalationTable
        escalations={escalations}
        onViewDetails={setSelectedEscalation}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        pagination={{ currentPage: page, pageSize: 20, totalItems: total, onPageChange: setPage }}
      />

      <CaseDetailsDrawer
        isOpen={Boolean(selectedEscalation)}
        onClose={() => setSelectedEscalation(null)}
        caseItem={selectedEscalation}
        title="Escalation Case Details"
        subtitle="Critical case audit & escalation logs"
      />
    </div>
  );
};
