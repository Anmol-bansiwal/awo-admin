import React, { useEffect } from 'react';
import { X, Clock, Edit3, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import { formatDate } from '../../../utils/formatters';
import type { PolicyContent } from '../notifications-content.types';

interface PolicyLivePreviewModalProps {
  isOpen: boolean;
  policy: PolicyContent | null;
  onClose: () => void;
  onEdit?: (policy: PolicyContent) => void;
}

/** Typography styles applied to the rendered policy HTML. */
const PROSE_CLASSES = `
  text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-sans max-w-none
  [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h1]:mt-2 [&_h1]:mb-3
  [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-4 [&_h2]:mb-2
  [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:dark:text-slate-200 [&_h3]:mt-3 [&_h3]:mb-1
  [&_p]:mb-3 [&_p]:leading-relaxed
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1.5
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1.5
  [&_li]:text-slate-700 [&_li]:dark:text-slate-300
  [&_blockquote]:border-l-3 [&_blockquote]:border-[#38B449] [&_blockquote]:pl-3 [&_blockquote]:italic
    [&_blockquote]:text-slate-500 [&_blockquote]:dark:text-slate-400 [&_blockquote]:my-3
  [&_a]:text-[#38B449] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#2e963c]
  [&_hr]:my-4 [&_hr]:border-slate-200 [&_hr]:dark:border-slate-700
  [&_strong]:font-bold [&_strong]:text-slate-900 [&_strong]:dark:text-white
`.trim().replace(/\s+/g, ' ');

export const PolicyLivePreviewModal: React.FC<PolicyLivePreviewModalProps> = ({
  isOpen,
  policy,
  onClose,
  onEdit,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !policy) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleEdit = () => {
    onClose();
    onEdit?.(policy);
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#38B449] flex items-center justify-center border border-emerald-100 dark:border-emerald-800/40 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {policy.title}
                </h3>
                <StatusBadge label={policy.version || 'v1.0'} variant="teal" size="sm" shape="pill" />
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {formatDate(policy.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Document</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-800/20">
          <div
            className={PROSE_CLASSES}
            dangerouslySetInnerHTML={{ __html: policy.content || '' }}
          />
        </div>
      </div>
    </div>
  );
};