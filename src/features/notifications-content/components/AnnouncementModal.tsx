import React, { useState, useEffect } from 'react';
import { X, Send, Megaphone, CheckCircle2, FileText, Users } from 'lucide-react';
import type {
  Announcement,
  AnnouncementAudience,
  AnnouncementStatus,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from '../notifications-content.types';

interface AnnouncementModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  announcement?: Announcement | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (
    payload: CreateAnnouncementPayload | UpdateAnnouncementPayload
  ) => Promise<void>;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  mode,
  announcement,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<AnnouncementAudience>('ALL');
  const [status, setStatus] = useState<AnnouncementStatus>('PUBLISHED');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && announcement) {
        setTitle(announcement.title);
        setMessage(announcement.message);
        setTargetAudience(announcement.target_audience);
        setStatus(announcement.status);
      } else {
        setTitle('');
        setMessage('');
        setTargetAudience('ALL');
        setStatus('PUBLISHED');
      }
      setError(null);
    }
  }, [isOpen, mode, announcement]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Announcement title is required.');
      return;
    }
    if (!message.trim()) {
      setError('Announcement message content is required.');
      return;
    }

    try {
      setError(null);
      await onSubmit({
        title: title.trim(),
        message: message.trim(),
        target_audience: targetAudience,
        status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save announcement.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-5 my-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {mode === 'create' ? 'Broadcast New Announcement' : 'Edit Announcement'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {mode === 'create'
                    ? 'Publish a notification to customers or providers.'
                    : 'Modify the selected platform announcement.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Announcement Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scheduled Platform Maintenance Notice"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Target Audience & Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as AnnouncementAudience)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="ALL">All Users (Public)</option>
                  <option value="CUSTOMERS">Customers Only</option>
                  <option value="PROVIDERS">Providers Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AnnouncementStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="PUBLISHED">Published (Live)</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the full announcement message here..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all resize-y"
                disabled={isLoading}
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#006E1C] hover:bg-[#005716] shadow-sm shadow-emerald-600/20 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    {mode === 'create' ? <Send className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{mode === 'create' ? 'Publish Announcement' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
