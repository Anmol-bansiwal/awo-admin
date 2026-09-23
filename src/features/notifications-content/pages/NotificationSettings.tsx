import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertCircle,
  Save,
  RotateCcw,
  Mail,
  MessageSquare,
  Smartphone,
  AppWindow,
  Sliders,
} from 'lucide-react';
import { AwoLoader } from '../../../components/AwoLoader';
import { ToastAlert, type ToastMessage } from '../../../components/ToastAlert';
import {
  useNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from '../hooks/useNotificationSettings';
import type { NotificationGroup } from '../notifications-content.types';

const CHANNELS = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'sms', label: 'SMS', icon: MessageSquare },
  { key: 'push', label: 'Push', icon: Smartphone },
  { key: 'in_app', label: 'In-App', icon: AppWindow },
] as const;

export const NotificationSettings: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useNotificationSettingsQuery();
  const updateMutation = useUpdateNotificationSettingsMutation();

  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (data?.groups) {
      setGroups(JSON.parse(JSON.stringify(data.groups)));
      setIsDirty(false);
    }
  }, [data]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleToggle = (
    groupId: string,
    itemId: string,
    channel: 'email' | 'sms' | 'push' | 'in_app'
  ) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((item) => {
            if (item.id !== itemId) return item;
            return {
              ...item,
              [channel]: !item[channel],
            };
          }),
        };
      })
    );
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ groups });
      setIsDirty(false);
      showToast('success', 'Notification preferences saved successfully.');
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Failed to save notification settings.'
      );
    }
  };

  const handleReset = () => {
    if (data?.groups) {
      setGroups(JSON.parse(JSON.stringify(data.groups)));
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <AwoLoader size="lg" message="Loading notification settings..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/40">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Failed to Load Notification Settings
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

      {/* Header Banner with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#006E1C] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Notification Configuration
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure delivery channels (Email, SMS, Push, In-App) across all platform event triggers.
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
            className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0 ${isDirty
                ? 'bg-[#006E1C] hover:bg-[#005716] shadow-emerald-600/20'
                : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70'
              }`}
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notification Categories Groups */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden"
          >
            {/* Group Header */}
            <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#006E1C] dark:text-emerald-400" />
                  {group.category}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {group.description}
                </p>
              </div>

              {/* Legend for Large Screens */}
              <div className="hidden lg:flex items-center space-x-6 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pr-4">
                {CHANNELS.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center space-x-1.5 w-16 justify-center">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Items List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors"
                >
                  {/* Event Label & Details */}
                  <div className="space-y-1 max-w-xl">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Channel Switch Toggles */}
                  <div className="flex items-center space-x-6 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 justify-end">
                    {CHANNELS.map(({ key, label, icon: Icon }) => {
                      const isChecked = item[key];
                      return (
                        <div
                          key={key}
                          className="flex flex-col lg:flex-row items-center gap-1.5 w-16 justify-center"
                        >
                          <span className="text-[10px] text-slate-400 lg:hidden flex items-center gap-1">
                            <Icon className="w-3 h-3" /> {label}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggle(group.id, item.id, key)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isChecked ? 'bg-[#006E1C]' : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            title={`Toggle ${label} notifications`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isChecked ? 'translate-x-4' : 'translate-x-0'
                                }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
