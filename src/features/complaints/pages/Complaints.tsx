import React, { useState } from 'react';
import { MessageSquareWarning } from 'lucide-react';
import { useComplaintsQuery } from '../hooks/useComplaints';
import { ComplaintTable } from '../components/CaseTable';
import { CaseDetailsDrawer } from '../components/CaseDetailsDrawer';
import { CasePageHeader, CaseFilterToolbar } from '../components/CaseToolbar';
import type { CustomerComplaint } from '../complaints.types';

export const Complaints: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<CustomerComplaint | null>(null);

  const { data: response, isLoading, isError, error, refetch, isFetching } = useComplaintsQuery(
    page,
    20,
    statusFilter,
    searchQuery,
    priorityFilter
  );

  const complaints = (response?.data as CustomerComplaint[]) || [];
  const total = response?.metadata?.total ?? complaints.length;

  return (
    <div className="space-y-6">
      <CasePageHeader
        icon={<MessageSquareWarning className="w-7 h-7 text-rose-600 dark:text-rose-400" />}
        title="Customer Complaints"
        subtitle="Review and investigate customer feedback, service delivery issues, and quality grievances."
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
        searchPlaceholder="Search by case ID, customer, booking, subject..."
      />

      <ComplaintTable
        complaints={complaints}
        onViewDetails={setSelectedComplaint}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        pagination={{ currentPage: page, pageSize: 20, totalItems: total, onPageChange: setPage }}
      />

      <CaseDetailsDrawer
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        caseItem={selectedComplaint}
        title="Complaint Details"
        subtitle="Customer grievance & evidence review"
      />
    </div>
  );
};
