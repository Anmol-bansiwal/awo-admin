import React, { useState } from 'react';
import {
  FileText,
  History,
  Wallet,
  Lock,
  RotateCcw,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { AwoLoader } from '../../../components/AwoLoader';
import { ToastAlert, type ToastMessage } from '../../../components/ToastAlert';
import { formatDate } from '../../../utils/formatters';
import {
  usePoliciesContentQuery,
  useUpdatePolicyMutation,
} from '../hooks/usePoliciesContent';
import type { PolicyContent, PolicySlug } from '../notifications-content.types';
import { PolicyEditModal } from '../components/PolicyEditModal';
import { PolicyLivePreviewModal } from '../components/PolicyLivePreviewModal';
import { AuditLogModal } from '../components/AuditLogModal';
import { PolicyCard } from '../components/PolicyCard';

interface PolicyCardConfig {
  slug: PolicySlug;
  title: string;
  defaultVersion: string;
  description: string;
  icon: LucideIcon;
}

const POLICY_CARDS_CONFIG: PolicyCardConfig[] = [
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    defaultVersion: 'v2.4',
    description:
      'Governs customer agreements, dispute resolution procedures and marketplace liability limits.',
    icon: FileText,
  },
  {
    slug: 'cancellation-policy',
    title: 'Provider Escrow & Cancellation Policy',
    defaultVersion: 'v3.1',
    description:
      'Escrow retention timeline, 48-hour provider payout guarantees, and refund deductions.',
    icon: Wallet,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    defaultVersion: 'v2.0',
    description:
      'Data residency clauses, identity verification tokenization rules, and cookie opt-outs.',
    icon: Lock,
  },
  {
    slug: 'refund-policy',
    title: 'Dispute Resolution & Customer Refund Policy',
    defaultVersion: 'v1.5',
    description:
      'Customer claim submission windows, investigation turnaround, and compensation workflows.',
    icon: RotateCcw,
  },
  {
    slug: 'about-us',
    title: 'About AWO Platform & Company Mission',
    defaultVersion: 'v1.2',
    description:
      'Platform mission, trust pillars, corporate contact details, and company background.',
    icon: Building2,
  },
];

export const PoliciesContent: React.FC = () => {
  const { data: policiesList, isLoading, isError, error, refetch } = usePoliciesContentQuery();
  const updateMutation = useUpdatePolicyMutation();

  // Active Modals State
  const [editingPolicy, setEditingPolicy] = useState<PolicyContent | null>(null);
  const [previewPolicy, setPreviewPolicy] = useState<PolicyContent | null>(null);
  const [auditLogDocument, setAuditLogDocument] = useState<string | null>(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenEdit = (policy: PolicyContent) => {
    setEditingPolicy(policy);
  };

  const handleOpenPreview = (policy: PolicyContent) => {
    setPreviewPolicy(policy);
  };


  const handleOpenFullAuditLog = () => {
    setAuditLogDocument(null);
    setIsAuditLogOpen(true);
  };

  const handleSavePolicy = async (payload: {
    title: string;
    version: string;
    content: string;
  }) => {
    if (!editingPolicy) return;

    try {
      await updateMutation.mutateAsync({
        slug: editingPolicy.slug,
        payload: {
          title: payload.title,
          version: payload.version,
          content: payload.content,
        },
      });

      showToast('success', `${payload.title} saved and published successfully.`);
      setEditingPolicy(null);
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Failed to save and publish policy.'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <AwoLoader size="lg" message="Loading policies and legal documents..." />
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
            Failed to Load Legal Documents
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-brand-gradient hover:opacity-95 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Find policies or fall back to default configs
  const getPolicyBySlug = (slug: PolicySlug): PolicyContent | undefined => {
    return policiesList?.find((p) => p.slug === slug);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <ToastAlert toast={toast} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Policies & Static Content
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenFullAuditLog}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Full Audit Log</span>
        </button>
      </div>

      {/* Main Grid: Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Render Primary Policy Cards */}
        {POLICY_CARDS_CONFIG.map((cfg) => {
          const policy = getPolicyBySlug(cfg.slug);
          const displayTitle = cfg.title;
          const isPublished = policy?.is_active ?? true;
          const updatedDate = policy?.updated_at
            ? formatDate(policy.updated_at)
            : '14 Oct 2024';

          return (
            <PolicyCard
              key={cfg.slug}
              title={displayTitle}
              status={isPublished ? 'Published' : 'Draft'}
              description={cfg.description}
              updatedDate={updatedDate}
              icon={cfg.icon}
              onEdit={() =>
                policy &&
                handleOpenEdit({
                  ...policy,
                  title: policy.title || cfg.title,
                })
              }
              onViewLive={() =>
                policy &&
                handleOpenPreview({
                  ...policy,
                  title: policy.title || cfg.title,
                })
              }
            />
          );
        })}
      </div>

      {/* Edit Policy Modal with WYSIWYG Rich Text Editor */}
      <PolicyEditModal
        isOpen={Boolean(editingPolicy)}
        policy={editingPolicy}
        isSaving={updateMutation.isPending}
        onClose={() => setEditingPolicy(null)}
        onSave={handleSavePolicy}
      />

      {/* Live Preview Modal */}
      <PolicyLivePreviewModal
        isOpen={Boolean(previewPolicy)}
        policy={previewPolicy}
        onClose={() => setPreviewPolicy(null)}
        onEdit={(pol) => handleOpenEdit(pol)}
      />

      {/* Audit Log / Revision History Modal */}
      <AuditLogModal
        isOpen={isAuditLogOpen}
        filterDocument={auditLogDocument}
        onClose={() => setIsAuditLogOpen(false)}
      />
    </div>
  );
};
