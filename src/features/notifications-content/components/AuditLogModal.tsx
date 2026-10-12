import React, { useState } from 'react';
import { X, History, Clock, User, Search } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';

interface AuditLogEntry {
  id: string;
  documentTitle: string;
  version: string;
  timestamp: string;
  author: string;
  summary: string;
  status: 'PUBLISHED' | 'ARCHIVED';
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-012',
    documentTitle: 'Terms of Service',
    version: 'v2.4',
    timestamp: '14 Oct 2024, 02:45 PM',
    author: 'AWO Admin',
    summary: 'Updated customer agreements, dispute resolution procedures and marketplace liability limits.',
    status: 'PUBLISHED',
  },
  {
    id: 'AUD-011',
    documentTitle: 'Provider Escrow & Cancellation Policy',
    version: 'v3.1',
    timestamp: '02 Nov 2024, 11:15 AM',
    author: 'AWO Admin',
    summary: 'Clarified escrow retention timeline, 48-hour provider payout guarantees, and refund deductions.',
    status: 'PUBLISHED',
  },
  {
    id: 'AUD-010',
    documentTitle: 'Privacy Policy',
    version: 'v2.0',
    timestamp: '28 Sep 2024, 09:30 AM',
    author: 'AWO Admin',
    summary: 'Added data residency clauses, identity verification tokenization rules, and cookie opt-outs.',
    status: 'PUBLISHED',
  },
  {
    id: 'AUD-009',
    documentTitle: 'Dispute Resolution & Refund Policy',
    version: 'v1.5',
    timestamp: '15 Sep 2024, 04:20 PM',
    author: 'Dispute Panel',
    summary: 'Refined 48-hour claim submission window and automated escrow return criteria.',
    status: 'PUBLISHED',
  },
  {
    id: 'AUD-008',
    documentTitle: 'Terms of Service',
    version: 'v2.3',
    timestamp: '20 Aug 2024, 10:00 AM',
    author: 'Legal Team',
    summary: 'Annual compliance review and clarification of provider verification standards.',
    status: 'ARCHIVED',
  },
  {
    id: 'AUD-007',
    documentTitle: 'Provider Escrow & Cancellation Policy',
    version: 'v3.0',
    timestamp: '01 Aug 2024, 01:10 PM',
    author: 'Finance Lead',
    summary: 'Implemented milestone-based escrow release schedules.',
    status: 'ARCHIVED',
  },
  {
    id: 'AUD-006',
    documentTitle: 'About Us & Platform Information',
    version: 'v1.2',
    timestamp: '10 Jul 2024, 03:00 PM',
    author: 'Editorial Team',
    summary: 'Updated company mission statement, trust pillars, and corporate contact details.',
    status: 'PUBLISHED',
  },
];

interface AuditLogModalProps {
  isOpen: boolean;
  filterDocument?: string | null;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  filterDocument,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  React.useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLogs = MOCK_AUDIT_LOGS.filter((entry) => {
    if (filterDocument && !entry.documentTitle.toLowerCase().includes(filterDocument.toLowerCase())) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        entry.documentTitle.toLowerCase().includes(q) ||
        entry.author.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.version.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <History className="w-5 h-5 text-[#38B449]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {filterDocument ? `${filterDocument} Revision History` : 'Platform Policies Audit Log'}
              </h3>
              <p className="text-xs text-slate-400">
                Complete traceability of document changes, publishing events, and authors
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search revisions by author, keyword, or version..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#38B449]/20 focus:border-[#38B449] transition-all"
            />
          </div>
        </div>

        {/* Timeline list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No audit logs found matching your search.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {log.documentTitle}
                    </span>
                    <StatusBadge label={log.version} variant="teal" size="sm" shape="pill" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      log.status === 'PUBLISHED'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {log.summary}
                </p>

                <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>by {log.author}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
