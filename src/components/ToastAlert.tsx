import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

export interface ToastAlertProps {
  toast: ToastMessage | null;
  onClose?: () => void;
  className?: string;
}

const TOAST_STYLES = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-200',
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
  },
};

export const ToastAlert: React.FC<ToastAlertProps> = ({ toast, onClose, className = '' }) => {
  if (!toast) return null;
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-200 ${style.bg} ${className}`}
    >
      <div className="flex items-center space-x-3">
        {style.icon}
        <span>{toast.text}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:opacity-75 transition-opacity cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
