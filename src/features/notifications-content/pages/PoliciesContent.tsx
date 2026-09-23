import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Clock,
  ShieldCheck,
  Eye,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import { AwoLoader } from '../../../components/AwoLoader';
import { StatusBadge } from '../../../components/StatusBadge';
import { ToastAlert, type ToastMessage } from '../../../components/ToastAlert';
import { formatDate } from '../../../utils/formatters';
import {
  usePoliciesContentQuery,
  useUpdatePolicyMutation,
} from '../hooks/usePoliciesContent';
import type { PolicySlug } from '../notifications-content.types';

const POLICY_TABS: { slug: PolicySlug; label: string; icon: string }[] = [
  { slug: 'terms-of-service', label: 'Terms of Service', icon: '📜' },
  { slug: 'privacy-policy', label: 'Privacy Policy', icon: '🔒' },
  { slug: 'cancellation-policy', label: 'Cancellation Policy', icon: '⏱️' },
  { slug: 'refund-policy', label: 'Refund Policy', icon: '💳' },
  { slug: 'about-us', label: 'About Us', icon: '🏢' },
];

export const PoliciesContent: React.FC = () => {
  const { data: policiesList, isLoading, isError, error, refetch } = usePoliciesContentQuery();
  const updateMutation = useUpdatePolicyMutation();

  const [selectedSlug, setSelectedSlug] = useState<PolicySlug>('terms-of-service');
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [activeVersion, setActiveVersion] = useState<string>('');
  const [activeContent, setActiveContent] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const currentPolicy = policiesList?.find((p) => p.slug === selectedSlug);

  useEffect(() => {
    if (currentPolicy) {
      setActiveTitle(currentPolicy.title);
      setActiveVersion(currentPolicy.version);
      setActiveContent(currentPolicy.content);
      setIsDirty(false);
      setIsPreviewMode(false);
    }
  }, [currentPolicy, selectedSlug]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSelectTab = (slug: PolicySlug) => {
    if (isDirty) {
      const confirmSwitch = window.confirm(
        'You have unsaved changes. Are you sure you want to switch policies?'
      );
      if (!confirmSwitch) return;
    }
    setSelectedSlug(slug);
  };

  const handleSave = async () => {
    if (!activeTitle.trim()) {
      showToast('error', 'Policy title is required.');
      return;
    }
    if (!activeContent.trim()) {
      showToast('error', 'Policy content cannot be empty.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        slug: selectedSlug,
        payload: {
          title: activeTitle.trim(),
          content: activeContent,
          version: activeVersion.trim() || 'v1.0',
        },
      });
      setIsDirty(false);
      showToast('success', `${activeTitle} updated successfully.`);
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Failed to update policy content.'
      );
    }
  };

  const handleReset = () => {
    if (currentPolicy) {
      setActiveTitle(currentPolicy.title);
      setActiveVersion(currentPolicy.version);
      setActiveContent(currentPolicy.content);
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <AwoLoader size="lg" message="Loading policies and static content..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/40">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Failed to Load Policies
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#006E1C] hover:bg-[#005716] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <ToastAlert toast={toast} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Policies & Static Content
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage legal agreements, terms of service, cancellation policies, and company information.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={updateMutation.isPending}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0 ${
              isDirty
                ? 'bg-[#006E1C] hover:bg-[#005716] shadow-emerald-600/20'
                : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Policy'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Policy Navigation Tabs & Document Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
            <p className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Platform Documents
            </p>
            {POLICY_TABS.map((tab) => {
              const isActive = selectedSlug === tab.slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => handleSelectTab(tab.slug)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#006E1C] dark:bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#006E1C]" />
              <span>Legal Compliance</span>
            </div>
            <p>
              Updating platform policies immediately impacts customer agreements and provider onboarding terms.
            </p>
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
          {/* Document Meta Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <StatusBadge
                  label={currentPolicy?.version || 'v1.0'}
                  variant="teal"
                  size="sm"
                  shape="pill"
                />
                <span className="text-xs font-mono text-slate-400">/{selectedSlug}</span>
              </div>

              {currentPolicy && (
                <div className="flex items-center space-x-4 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Updated: {formatDate(currentPolicy.updated_at)}
                    </span>
                  </div>
                  {currentPolicy.updated_by && (
                    <span>By: {currentPolicy.updated_by}</span>
                  )}
                </div>
              )}
            </div>

            {/* Document Title & Version Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Document Title
                </label>
                <input
                  type="text"
                  value={activeTitle}
                  onChange={(e) => {
                    setActiveTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
                  placeholder="e.g. Terms of Service"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Version
                </label>
                <input
                  type="text"
                  value={activeVersion}
                  onChange={(e) => {
                    setActiveVersion(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
                  placeholder="e.g. v2.4"
                />
              </div>
            </div>
          </div>

          {/* Mode Switcher Header */}
          <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {isPreviewMode ? 'Document Live Preview' : 'Content Editor (Markdown Supported)'}
            </span>

            <button
              type="button"
              onClick={() => setIsPreviewMode((prev) => !prev)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer shadow-2xs"
            >
              {isPreviewMode ? (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Switch to Editor</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Live Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Editor / Preview Content Body */}
          <div className="p-6 flex-1 min-h-[420px]">
            {isPreviewMode ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                {activeContent}
              </div>
            ) : (
              <textarea
                value={activeContent}
                onChange={(e) => {
                  setActiveContent(e.target.value);
                  setIsDirty(true);
                }}
                rows={18}
                placeholder="Write policy content here..."
                className="w-full p-4 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all resize-y"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
