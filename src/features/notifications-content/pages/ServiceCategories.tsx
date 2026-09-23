import React, { useState, useMemo } from 'react';
import {
  Folder,
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryIconMutation,
  useActivateCategoryMutation,
  useDeactivateCategoryMutation,
} from '../hooks/useCategories';
import { DataTable, type ColumnDef } from '../../../components/DataTable';
import { StatusBadge } from '../../../components/StatusBadge';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { SearchBar } from '../../../components/SearchBar';
import { ToastAlert, type ToastMessage } from '../../../components/ToastAlert';
import { formatDate } from '../../../utils/formatters';
import { CategoryCreateEditModal } from '../components/CategoryCreateEditModal';
import { CategoryDetailsDrawer } from '../components/CategoryDetailsDrawer';
import type { Category } from '../notifications-content.types';

export const ServiceCategories: React.FC = () => {
  const { data: rawCategories, isLoading, isError, error, refetch } = useCategoriesQuery();

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const updateIconMutation = useUpdateCategoryIconMutation();
  const activateMutation = useActivateCategoryMutation();
  const deactivateMutation = useDeactivateCategoryMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  // Form Modal (Create / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [activeFormCategory, setActiveFormCategory] = useState<Category | null>(null);

  // Details Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Confirm Modal (Activate / Deactivate)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState<'activate' | 'deactivate'>('deactivate');
  const [activeConfirmCategory, setActiveConfirmCategory] = useState<Category | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const categoriesList = rawCategories || [];

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesList;
    const q = searchQuery.toLowerCase().trim();
    return categoriesList.filter(
      (cat) => cat.name?.toLowerCase().includes(q) || cat.slug?.toLowerCase().includes(q)
    );
  }, [categoriesList, searchQuery]);

  const handleOpenCreate = () => {
    setFormMode('create');
    setActiveFormCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setFormMode('edit');
    setActiveFormCategory(cat);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (cat: Category) => {
    setSelectedCategoryId(cat.id);
    setIsDrawerOpen(true);
  };

  const handleOpenToggleStatus = (cat: Category) => {
    setConfirmActionType(cat.is_active ? 'deactivate' : 'activate');
    setActiveConfirmCategory(cat);
    setIsConfirmModalOpen(true);
  };

  const handleSubmitCreate = async (payload: { name: string; is_active: boolean; iconFile?: File }) => {
    try {
      const createdCategory = await createMutation.mutateAsync({
        name: payload.name,
        is_active: payload.is_active,
      });

      if (payload.iconFile && createdCategory?.id) {
        await updateIconMutation.mutateAsync({
          id: createdCategory.id,
          file: payload.iconFile,
        });
      }

      setIsFormModalOpen(false);
      showToast('success', `Category "${payload.name}" created successfully.`);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create category.');
    }
  };

  const handleSubmitEdit = async (payload: { name: string; sort_order?: number; iconFile?: File }) => {
    if (!activeFormCategory) return;
    try {
      await updateMutation.mutateAsync({
        id: activeFormCategory.id,
        payload: {
          name: payload.name,
          ...(payload.sort_order !== undefined && { sort_order: payload.sort_order }),
        },
      });

      if (payload.iconFile) {
        await updateIconMutation.mutateAsync({
          id: activeFormCategory.id,
          file: payload.iconFile,
        });
      }

      setIsFormModalOpen(false);
      showToast('success', `Category "${payload.name}" updated successfully.`);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update category.');
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!activeConfirmCategory) return;
    try {
      if (confirmActionType === 'deactivate') {
        await deactivateMutation.mutateAsync(activeConfirmCategory.id);
        showToast('success', `Category "${activeConfirmCategory.name}" deactivated.`);
      } else {
        await activateMutation.mutateAsync(activeConfirmCategory.id);
        showToast('success', `Category "${activeConfirmCategory.name}" activated.`);
      }
      setIsConfirmModalOpen(false);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  const isMutationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    updateIconMutation.isPending ||
    activateMutation.isPending ||
    deactivateMutation.isPending;

  const columns: ColumnDef<Category>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Category',
        render: (cat) => (
          <button
            type="button"
            onClick={() => handleViewDetails(cat)}
            className="flex items-center space-x-3 text-left w-full cursor-pointer group"
          >
            {cat.image_url ? (
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-2 group-hover:ring-[#006E1C]/40 dark:group-hover:ring-emerald-500/40 transition-all"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/40 group-hover:ring-2 group-hover:ring-[#006E1C]/40 dark:group-hover:ring-emerald-500/40 transition-all">
                <Folder className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 dark:text-white truncate text-xs group-hover:text-[#006E1C] dark:group-hover:text-emerald-400 transition-colors">
                {cat.name}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                {cat.slug || '—'}
              </span>
            </div>
          </button>
        ),
      },
      {
        key: 'sort_order',
        header: 'Sort Order',
        align: 'center',
        render: (cat) => (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs">
            {cat.sort_order ?? 0}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        align: 'center',
        render: (cat) => (
          <StatusBadge
            label={cat.is_active ? 'Active' : 'Inactive'}
            variant={cat.is_active ? 'success' : 'neutral'}
            dot
            size="sm"
          />
        ),
      },
      {
        key: 'created_at',
        header: 'Created At',
        render: (cat) => (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(cat.created_at)}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (cat) => (
          <div className="flex items-center justify-end space-x-1">
            <button
              type="button"
              onClick={() => handleViewDetails(cat)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="View Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenEdit(cat)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Category"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenToggleStatus(cat)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                cat.is_active
                  ? 'text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
              title={cat.is_active ? 'Deactivate Category' : 'Activate Category'}
            >
              {cat.is_active ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <ToastAlert toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Categories Data Table */}
      <DataTable<Category>
        data={filteredCategories}
        columns={columns}
        keyExtractor={(cat) => cat.id}
        isLoading={isLoading}
        loadingMessage="Loading service categories..."
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
        emptyTitle="No categories found"
        emptyMessage={
          searchQuery
            ? `No service categories matched "${searchQuery}".`
            : 'Create your first service category to get started.'
        }
        emptyIcon={<Folder className="w-7 h-7 text-[#006E1C] dark:text-emerald-400" />}
        emptyAction={
          !searchQuery ? (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#006E1C] hover:bg-[#005716] text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          ) : undefined
        }
        headerControl={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-80">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search categories..."
                size="sm"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Reset Search"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenCreate}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#006E1C] hover:bg-[#005716] text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        }
      />

      {/* Create / Edit Modal */}
      <CategoryCreateEditModal
        isOpen={isFormModalOpen}
        mode={formMode}
        category={activeFormCategory}
        isLoading={isMutationLoading}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCreate={handleSubmitCreate}
        onSubmitEdit={handleSubmitEdit}
      />

      {/* Right-Side Category Details Drawer */}
      <CategoryDetailsDrawer
        isOpen={isDrawerOpen}
        categoryId={selectedCategoryId}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Activate / Deactivate Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={confirmActionType === 'deactivate' ? 'Deactivate Category?' : 'Activate Category?'}
        description={
          activeConfirmCategory ? (
            <span>
              Are you sure you want to {confirmActionType}{' '}
              <strong className="text-slate-900 dark:text-white">"{activeConfirmCategory.name}"</strong>?
            </span>
          ) : (
            ''
          )
        }
        confirmText={confirmActionType === 'deactivate' ? 'Deactivate' : 'Activate'}
        variant={confirmActionType === 'deactivate' ? 'danger' : 'success'}
        isLoading={isMutationLoading}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export const Categories = ServiceCategories;
