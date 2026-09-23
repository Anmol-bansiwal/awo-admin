import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import { StatusBadge, type StatusBadgeVariant } from '../../../components/StatusBadge';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { ToastAlert, type ToastMessage } from '../../../components/ToastAlert';
import { SearchBar } from '../../../components/SearchBar';
import { formatDateTime } from '../../../utils/formatters';
import { AnnouncementModal } from '../components/AnnouncementModal';
import {
  useAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from '../hooks/useAnnouncements';
import type {
  Announcement,
  AnnouncementAudience,
  AnnouncementStatus,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from '../notifications-content.types';

export const Announcements: React.FC = () => {
  // Query & Mutation state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  const { data, isLoading, isError, error, refetch } = useAnnouncementsQuery(
    currentPage,
    pageSize,
    statusFilter,
    searchQuery,
    audienceFilter
  );

  const createMutation = useCreateAnnouncementMutation();
  const updateMutation = useUpdateAnnouncementMutation();
  const deleteMutation = useDeleteAnnouncementMutation();

  // Toast feedback state
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  const announcementsList = data?.data || [];
  const totalItems = data?.metadata?.total || announcementsList.length;

  const handleOpenCreate = () => {
    setFormMode('create');
    setSelectedAnnouncement(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setFormMode('edit');
    setSelectedAnnouncement(ann);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (ann: Announcement) => {
    setAnnouncementToDelete(ann);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitForm = async (
    payload: CreateAnnouncementPayload | UpdateAnnouncementPayload
  ) => {
    try {
      if (formMode === 'create') {
        await createMutation.mutateAsync(payload as CreateAnnouncementPayload);
        showToast('success', 'Announcement published successfully.');
      } else if (selectedAnnouncement) {
        await updateMutation.mutateAsync({
          id: selectedAnnouncement.id,
          payload: payload as UpdateAnnouncementPayload,
        });
        showToast('success', 'Announcement updated successfully.');
      }
      setIsFormModalOpen(false);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save announcement.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    try {
      await deleteMutation.mutateAsync(announcementToDelete.id);
      showToast('success', 'Announcement deleted successfully.');
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete announcement.');
    }
  };

  // Helpers for badge styles
  const getAudienceBadge = (audience: AnnouncementAudience) => {
    switch (audience) {
      case 'ALL':
        return { label: 'All Users', variant: 'teal' as StatusBadgeVariant };
      case 'CUSTOMERS':
        return { label: 'Customers', variant: 'indigo' as StatusBadgeVariant };
      case 'PROVIDERS':
        return { label: 'Providers', variant: 'purple' as StatusBadgeVariant };
      default:
        return { label: audience, variant: 'neutral' as StatusBadgeVariant };
    }
  };

  const getStatusBadge = (status: AnnouncementStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return { label: 'Published', variant: 'success' as StatusBadgeVariant, dot: true };
      case 'DRAFT':
        return { label: 'Draft', variant: 'warning' as StatusBadgeVariant, dot: true };
      case 'ARCHIVED':
        return { label: 'Archived', variant: 'neutral' as StatusBadgeVariant, dot: false };
      default:
        return { label: status, variant: 'neutral' as StatusBadgeVariant, dot: false };
    }
  };

  // Table Columns
  const columns: ColumnDef<Announcement>[] = useMemo(
    () => [
      {
        key: 'title',
        header: 'Announcement Details',
        align: 'left',
        render: (item) => (
          <div className="space-y-1 max-w-md py-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs line-clamp-1">
                {item.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.message}
            </p>
          </div>
        ),
      },
      {
        key: 'target_audience',
        header: 'Target Audience',
        align: 'center',
        render: (item) => {
          const badge = getAudienceBadge(item.target_audience);
          return (
            <StatusBadge
              label={badge.label}
              variant={badge.variant}
              size="sm"
              shape="pill"
            />
          );
        },
      },
      {
        key: 'status',
        header: 'Status',
        align: 'center',
        render: (item) => {
          const badge = getStatusBadge(item.status);
          return (
            <StatusBadge
              label={badge.label}
              variant={badge.variant}
              dot={badge.dot}
              size="sm"
              shape="rounded"
            />
          );
        },
      },
      {
        key: 'created_at',
        header: 'Created Date',
        align: 'left',
        render: (item) => (
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {formatDateTime(item.created_at)}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (item) => (
          <div className="flex items-center justify-end space-x-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEdit(item);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit announcement"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDelete(item);
              }}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              title="Delete announcement"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <ToastAlert toast={toast} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Platform Announcements
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish system advisories, policy updates, and promotions to customers and providers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#006E1C] hover:bg-[#005716] text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Filter & Search Bar + Data Table */}
      <DataTable<Announcement>
        data={announcementsList}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        loadingMessage="Loading announcements..."
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
        emptyTitle="No Announcements Found"
        emptyMessage="There are currently no platform announcements matching your filters."
        emptyAction={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-[#006E1C] hover:bg-[#005716] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Announcement</span>
          </button>
        }
        pagination={{
          currentPage,
          pageSize,
          totalItems,
          onPageChange: (p) => setCurrentPage(p),
          itemName: 'announcements',
        }}
        headerControl={
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                placeholder="Search announcements by title or content..."
                size="sm"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select
                value={audienceFilter}
                onChange={(e) => {
                  setAudienceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all cursor-pointer"
              >
                <option value="all">All Audiences</option>
                <option value="ALL">Public (All Users)</option>
                <option value="CUSTOMERS">Customers Only</option>
                <option value="PROVIDERS">Providers Only</option>
              </select>

              {(searchQuery || statusFilter !== 'all' || audienceFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setAudienceFilter('all');
                    setCurrentPage(1);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        }
      />

      {/* Create / Edit Modal */}
      <AnnouncementModal
        isOpen={isFormModalOpen}
        mode={formMode}
        announcement={selectedAnnouncement}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Announcement"
        description={
          announcementToDelete ? (
            <span>
              Are you sure you want to delete announcement{' '}
              <strong className="text-slate-900 dark:text-white">
                "{announcementToDelete.title}"
              </strong>
              ? This action cannot be undone.
            </span>
          ) : (
            ''
          )
        }
        confirmText="Delete Announcement"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
