import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, FolderPlus, Edit3, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import type { Category } from '../notifications-content.types';

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Category name is required' }),
  is_active: z.boolean(),
  sort_order: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Sort order must be a positive number or 0',
    }),
});

type CategoryFormData = z.infer<typeof createCategorySchema>;

interface CategoryCreateEditModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  category: Category | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmitCreate: (data: { name: string; is_active: boolean; iconFile?: File }) => void;
  onSubmitEdit: (data: { name: string; sort_order?: number; iconFile?: File }) => void;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

export const CategoryCreateEditModal: React.FC<CategoryCreateEditModalProps> = ({
  isOpen,
  mode,
  category,
  isLoading,
  onClose,
  onSubmitCreate,
  onSubmitEdit,
}) => {
  const isEdit = mode === 'edit';

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      is_active: true,
      sort_order: '0',
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedFile(null);
      setIconPreview(null);
      setFileError(null);

      if (isEdit && category) {
        reset({
          name: category.name || '',
          is_active: category.is_active ?? true,
          sort_order: category.sort_order !== undefined ? String(category.sort_order) : '0',
        });
      } else {
        reset({
          name: '',
          is_active: true,
          sort_order: '0',
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isEdit, category, reset]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const isSvgExtension = file.name.toLowerCase().endsWith('.svg');
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !isSvgExtension) {
      setFileError('Invalid image format. Allowed formats: JPEG, PNG, WEBP, SVG.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const convertSvgToPng = async (file: File): Promise<File> => {
    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    if (!isSvg) return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const targetSize = 512;
          const width = img.naturalWidth || img.width || targetSize;
          const height = img.naturalHeight || img.height || targetSize;

          const scale = Math.max(1, targetSize / Math.max(width, height));
          canvas.width = Math.round(width * scale);
          canvas.height = Math.round(height * scale);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(file);
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            const pngName = file.name.replace(/\.svg$/i, '.png');
            const pngFile = new File([blob], pngName, { type: 'image/png' });
            resolve(pngFile);
          }, 'image/png');
        };

        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const onFormSubmit = async (data: CategoryFormData) => {
    let fileToUpload = selectedFile;
    if (selectedFile) {
      fileToUpload = await convertSvgToPng(selectedFile);
    }

    if (isEdit) {
      const parsedSortOrder = data.sort_order ? Number(data.sort_order) : undefined;
      onSubmitEdit({
        name: data.name,
        ...(parsedSortOrder !== undefined && { sort_order: parsedSortOrder }),
        ...(fileToUpload && { iconFile: fileToUpload }),
      });
    } else {
      onSubmitCreate({
        name: data.name,
        is_active: data.is_active,
        ...(fileToUpload && { iconFile: fileToUpload }),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-6 transform transition-all my-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/40">
                {isEdit ? <Edit3 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {isEdit ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {isEdit
                    ? 'Update service category details'
                    : 'Add a new service category to the catalog'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Category Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="category_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="category_name"
                type="text"
                placeholder="e.g. Window Cleaning"
                disabled={isLoading}
                {...register('name')}
                className={`block w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border ${errors.name
                  ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500 focus:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-[#006E1C] focus:border-[#006E1C]'
                  } rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 dark:disabled:bg-slate-800/60 disabled:text-slate-500`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Category Icon File Upload Field (Includes SVG) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Category Icon <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(jpeg, png, webp, svg)</span>
              </label>
              <div className="flex items-center space-x-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Category Icon Preview"
                    className="w-12 h-12 rounded-xl object-contain ring-2 ring-emerald-500/30 shrink-0 bg-white dark:bg-slate-800"
                  />
                ) : category?.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-12 h-12 rounded-xl object-contain ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 bg-white dark:bg-slate-800"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/40">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <input
                    type="file"
                    id="icon_file_input"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg"
                    disabled={isLoading}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="icon_file_input"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-850 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{selectedFile ? 'Change Icon' : 'Upload Icon'}</span>
                  </label>
                  {selectedFile ? (
                    <p className="text-[11px] text-[#006E1C] dark:text-emerald-400 font-semibold truncate mt-1">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1">
                      Format: JPEG, PNG, WEBP, SVG
                    </p>
                  )}
                </div>
              </div>
              {fileError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{fileError}</p>
              )}
            </div>

            {/* Sort Order Field (Edit mode) */}
            {isEdit && (
              <div className="space-y-1.5">
                <label htmlFor="sort_order" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Sort Order
                </label>
                <input
                  id="sort_order"
                  type="number"
                  placeholder="0"
                  disabled={isLoading}
                  {...register('sort_order')}
                  className={`block w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border ${errors.sort_order
                    ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-[#006E1C] focus:border-[#006E1C]'
                    } rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 dark:disabled:bg-slate-800/60 disabled:text-slate-500`}
                />
                {errors.sort_order && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                    {errors.sort_order.message}
                  </p>
                )}
              </div>
            )}

            {/* Status Switch (Create mode) */}
            {!isEdit && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">Status</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Set whether this category is immediately active.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    {...register('is_active')}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006E1C]"></div>
                </label>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#006E1C] hover:bg-[#005716] shadow-sm shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
                  </>
                ) : (
                  <span>{isEdit ? 'Save Changes' : 'Create Category'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
