import React from 'react';
import { Folder, Calendar, Tag, Hash, Layers, ShieldCheck } from 'lucide-react';
import { useCategoryDetailsQuery } from '../hooks/useCategories';
import { StatusBadge } from '../../../components/StatusBadge';
import { DetailsDrawer } from '../../../components/DetailsDrawer';
import { formatDate } from '../../../utils/formatters';

interface CategoryDetailsDrawerProps {
  isOpen: boolean;
  categoryId: string | null;
  onClose: () => void;
}

export const CategoryDetailsDrawer: React.FC<CategoryDetailsDrawerProps> = ({
  isOpen,
  categoryId,
  onClose,
}) => {
  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useCategoryDetailsQuery(categoryId || '');

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Category Details"
      subtitle="Service catalog category specifications"
      icon={
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/40 shrink-0">
          <Folder className="w-5 h-5" />
        </div>
      }
      maxWidthClassName="max-w-md"
      isLoading={isLoading}
      loadingMessage="Fetching category details..."
      isError={isError}
      errorMessage={error instanceof Error ? error.message : 'Failed to load category details.'}
      showDefaultFooter
    >
      {category && (
        <div className="space-y-6">
          {/* Category Image / Avatar Hero */}
          <DetailsDrawer.Hero
            avatar={
              category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : undefined
            }
            icon={!category.image_url ? <Folder className="w-8 h-8" /> : undefined}
            title={category.name}
            subtitle={category.slug}
            badge={
              <StatusBadge
                label={category.is_active ? 'Active' : 'Inactive'}
                variant={category.is_active ? 'success' : 'neutral'}
                dot
                size="sm"
              />
            }
          />

          {/* Details Breakdown */}
          <DetailsDrawer.Section title="Category Configuration">
            <DetailsDrawer.Row
              icon={<Tag className="w-4 h-4" />}
              label="Name"
              value={category.name}
            />

            <DetailsDrawer.Row
              icon={<Layers className="w-4 h-4" />}
              label="Slug"
              value={category.slug}
              mono
            />

            <DetailsDrawer.Row
              icon={<Hash className="w-4 h-4" />}
              label="Sort Order"
              value={category.sort_order}
            />

            <DetailsDrawer.Row
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Status"
              value={
                <StatusBadge
                  label={category.is_active ? 'Active' : 'Inactive'}
                  variant={category.is_active ? 'success' : 'neutral'}
                  dot
                  size="sm"
                />
              }
            />

            <DetailsDrawer.Row
              icon={<Calendar className="w-4 h-4" />}
              label="Created At"
              value={formatDate(category.created_at)}
            />

            <DetailsDrawer.Row
              icon={<Hash className="w-4 h-4" />}
              label="Category ID"
              value={category.id}
              mono
            />
          </DetailsDrawer.Section>
        </div>
      )}
    </DetailsDrawer>
  );
};
