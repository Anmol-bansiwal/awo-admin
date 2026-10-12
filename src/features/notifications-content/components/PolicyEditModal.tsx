import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, ShieldCheck, Loader2 } from 'lucide-react';
import { RichTextEditor } from '../../../components/RichTextEditor';
import type { PolicyContent } from '../notifications-content.types';

interface PolicyEditModalProps {
  isOpen: boolean;
  policy: PolicyContent | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: { title: string; version: string; content: string }) => Promise<void>;
}

export const PolicyEditModal: React.FC<PolicyEditModalProps> = ({
  isOpen,
  policy,
  isSaving,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && policy) {
      setTitle(policy.title);
      setVersion(policy.version);
      setContent(policy.content || '');
      setIsDirty(false);
      setError(null);
    }
  }, [isOpen, policy]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !policy) return null;

  const handleClose = () => {
    if (isDirty && !isSaving) {
      const confirmDiscard = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them?'
      );
      if (!confirmDiscard) return;
    }
    onClose();
  };

  const handleReset = () => {
    setTitle(policy.title);
    setVersion(policy.version);
    setContent(policy.content || '');
    setIsDirty(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Document title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Document content cannot be empty.');
      return;
    }
    setError(null);

    await onSave({
      title: title.trim(),
      version: version.trim() || 'v1.0',
      content,
    });
    setIsDirty(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#38B449] flex items-center justify-center border border-emerald-100 dark:border-emerald-800/40 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Policy: {policy.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-4 flex-1">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
                {error}
              </div>
            )}

            {/* Document Title & Version Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-[#38B449]/20 focus:border-[#38B449] transition-all"
                  placeholder="e.g. Terms of Service"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Version
                </label>
                <input
                  type="text"
                  value={version}
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed select-none"
                  title="Version is managed automatically"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-1.5 flex flex-col flex-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Document Content
              </label>
              <RichTextEditor
                value={content}
                onChange={(newHtml: string) => {
                  setContent(newHtml);
                  setIsDirty(true);
                }}
                placeholder="Write rich policy content with headings, lists, and formatted text..."
                minHeight="380px"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {isDirty ? (
                <span className="text-amber-500 font-medium">● Unsaved changes</span>
              ) : (
                'All changes saved'
              )}
            </span>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isDirty || isSaving}
                className={`inline-flex items-center justify-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                  isDirty && !isSaving
                    ? 'bg-brand-gradient hover:opacity-95 shadow-sm'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Policy...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Policy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
