import React from 'react';
import { Percent, RefreshCw, AlertCircle } from 'lucide-react';
import { useCommissionConfigQuery, useUpdateCommissionMutation } from '../hooks/useCommission';
import { CommissionSettings } from '../components/CommissionSettings';
import { AwoLoader } from '../../../components/AwoLoader';
import type { CommissionUpdateRequest } from '../finance.types';

export const Commission: React.FC = () => {
  const { data: config, isLoading, isError, error, refetch, isFetching } = useCommissionConfigQuery();
  const updateMutation = useUpdateCommissionMutation();

  const handleSave = async (payload: CommissionUpdateRequest) => {
    await updateMutation.mutateAsync(payload);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Percent className="w-7 h-7 text-[#006E1C] dark:text-emerald-400" />
            <span>Commission Configurations</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure default and category-specific platform service fees and revenue shares.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* CONTENT AREA */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <AwoLoader size="md" message="Loading commission configuration..." />
        </div>
      ) : isError ? (
        <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/40">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Failed to load commission settings</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {error instanceof Error ? error.message : 'Unable to connect to the configuration server.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#006E1C] hover:bg-[#005716] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <CommissionSettings
          config={config}
          isLoading={isLoading}
          isSaving={updateMutation.isPending}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
