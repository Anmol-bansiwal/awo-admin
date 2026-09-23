import React from 'react';

export type StatusBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'indigo'
  | 'teal'
  | 'sky'
  | 'purple'
  | 'neutral';

export interface StatusBadgeProps {
  label: React.ReactNode;
  variant?: StatusBadgeVariant;
  icon?: React.ReactNode;
  dot?: boolean;
  pulseDot?: boolean;
  shape?: 'pill' | 'rounded';
  size?: 'sm' | 'md';
  uppercase?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<
  StatusBadgeVariant,
  { badge: string; dot: string }
> = {
  success: {
    badge:
      'bg-[#EAF7EC] dark:bg-emerald-950/50 text-[#006E1C] dark:text-emerald-400 border-[#006E1C]/20 dark:border-emerald-800/40',
    dot: 'bg-[#006E1C] dark:bg-emerald-400',
  },
  warning: {
    badge:
      'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/40',
    dot: 'bg-amber-500',
  },
  danger: {
    badge:
      'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/40',
    dot: 'bg-rose-500',
  },
  info: {
    badge:
      'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/40',
    dot: 'bg-blue-500',
  },
  indigo: {
    badge:
      'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/40',
    dot: 'bg-indigo-500',
  },
  teal: {
    badge:
      'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border-teal-200/80 dark:border-teal-800/40',
    dot: 'bg-teal-500',
  },
  sky: {
    badge:
      'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/40',
    dot: 'bg-sky-500',
  },
  purple: {
    badge:
      'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/40',
    dot: 'bg-purple-500',
  },
  neutral: {
    badge:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  dot = false,
  pulseDot = false,
  shape = 'rounded',
  size = 'sm',
  uppercase = true,
  className = '',
}) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;

  const shapeClass = shape === 'pill' ? 'rounded-full' : 'rounded-md';
  const sizeClass =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px] gap-1.5'
      : 'px-3 py-1 text-xs gap-2 font-semibold';
  const textTransform = uppercase ? 'uppercase tracking-wider font-bold' : 'font-semibold';

  return (
    <span
      className={`inline-flex items-center border transition-colors shadow-2xs ${styles.badge} ${shapeClass} ${sizeClass} ${textTransform} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${pulseDot ? 'animate-pulse' : ''
            } shrink-0`}
        />
      )}
      <span className="truncate">{label}</span>
    </span>
  );
};
