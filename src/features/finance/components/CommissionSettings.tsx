import React, { useState, useEffect } from 'react';
import { Percent, Save, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import type { CommissionConfig } from '../finance.types';

interface CommissionSettingsProps {
  config?: CommissionConfig | null;
  isLoading?: boolean;
  isSaving?: boolean;
  onSave?: (payload: {
    default_commission_percentage: number;
    category_commissions?: { category_id: string; commission_percentage: number }[];
  }) => Promise<void>;
}

export const CommissionSettings: React.FC<CommissionSettingsProps> = ({
  config,
  isLoading = false,
  isSaving = false,
  onSave,
}) => {
  const [defaultRate, setDefaultRate] = useState<number | string>('');
  const [categoryRates, setCategoryRates] = useState<
    { category_id: string; category_name: string; commission_percentage: number | string }[]
  >([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setDefaultRate(config.default_commission_percentage ?? '');
      if (config.category_commissions) {
        setCategoryRates(
          config.category_commissions.map((c) => ({
            category_id: c.category_id,
            category_name: c.category_name,
            commission_percentage: c.commission_percentage,
          }))
        );
      }
    }
  }, [config]);

  const handleCategoryRateChange = (categoryId: string, val: string) => {
    setCategoryRates((prev) =>
      prev.map((c) =>
        c.category_id === categoryId
          ? { ...c, commission_percentage: val === '' ? '' : Number(val) }
          : c
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const numericDefault = Number(defaultRate);
    if (isNaN(numericDefault) || numericDefault < 0 || numericDefault > 100) {
      setErrorMessage('Please provide a valid default commission percentage between 0 and 100.');
      return;
    }

    try {
      if (onSave) {
        await onSave({
          default_commission_percentage: numericDefault,
          category_commissions: categoryRates.map((c) => ({
            category_id: c.category_id,
            commission_percentage: Number(c.commission_percentage) || 0,
          })),
        });
        setSuccessMessage('Commission configurations updated successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update commission settings.');
    }
  };

  if (isLoading && !config) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
        <div className="h-24 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toast Feedback */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Global Default Commission Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/40 shrink-0">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Default Platform Commission</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standard commission rate applied to completed service bookings across all categories.
            </p>
          </div>
        </div>

        <div className="max-w-xs space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Default Commission Rate (%)
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={defaultRate}
              onChange={(e) => setDefaultRate(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-sm">
              %
            </div>
          </div>
        </div>
      </div>

      {/* Category Specific Commission Overrides */}
      {categoryRates.length > 0 && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/40 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Category-Specific Commissions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customized commission percentages defined for specific service catalog categories.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {categoryRates.map((cat) => (
              <div
                key={cat.category_id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    {cat.category_name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    ID: {cat.category_id.slice(0, 10)}...
                  </span>
                </div>

                <div className="w-40 relative rounded-xl shadow-2xs shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={cat.commission_percentage}
                    onChange={(e) => handleCategoryRateChange(cat.category_id, e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006E1C]/20 focus:border-[#006E1C] transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-xs">
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#006E1C] hover:bg-[#005716] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save Changes'}</span>
          </button>
        </div>
      )}
    </form>
  );
};
