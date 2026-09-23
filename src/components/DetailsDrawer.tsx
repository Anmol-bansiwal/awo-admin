import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AwoLoader } from './AwoLoader';

export interface DetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  maxWidthClassName?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  showDefaultFooter?: boolean;
}

export interface DetailRowProps {
  icon?: React.ReactNode | React.ElementType;
  label: React.ReactNode;
  value?: React.ReactNode;
  subvalue?: React.ReactNode;
  mono?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  value,
  subvalue,
  mono = false,
  className = '',
  children,
}) => {
  /** Helper to render icon whether passed as a Lucide component or pre-rendered JSX element */
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ElementType;
    return <IconComponent className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />;
  };

  return (
    <div
      className={`p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between text-xs transition-colors duration-150 gap-3 ${className}`}
    >
      <div className="flex items-center space-x-2.5 text-slate-500 dark:text-slate-400 shrink-0 min-w-0">
        {renderIcon()}
        <span className="font-medium truncate">{label}</span>
      </div>

      {children ? (
        <div className="shrink-0">{children}</div>
      ) : (
        <div className="flex flex-col min-w-0 justify-end text-right">
          {React.isValidElement(value) ? (
            value
          ) : (
            <span
              className={`font-semibold text-slate-900 dark:text-white truncate ${mono ? 'font-mono select-all' : ''
                }`}
            >
              {value ?? '—'}
            </span>
          )}
          {subvalue && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate">
              {subvalue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export interface DetailSectionProps {
  title?: string;
  icon?: React.ReactNode | React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  icon,
  action,
  children,
  className = '',
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ElementType;
    return <IconComponent className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />;
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            {renderIcon()}
            <h3 className="text-xs font-bold uppercase tracking-wider font-inter text-slate-500 dark:text-slate-400">
              {title}
            </h3>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export interface DetailHeroProps {
  label?: React.ReactNode;
  subtitle?: React.ReactNode;
  value?: React.ReactNode;
  title?: React.ReactNode;
  subtext?: React.ReactNode;
  badge?: React.ReactNode;
  avatar?: React.ReactNode;
  icon?: React.ReactNode | React.ElementType;
  className?: string;
}

const DetailHero: React.FC<DetailHeroProps> = ({
  label,
  subtitle,
  value,
  title,
  subtext,
  badge,
  avatar,
  icon,
  className = '',
}) => {
  const displayLabel = label || subtitle;
  const displayValue = value || title;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as React.ElementType;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2 transition-colors shadow-2xs ${className}`}
    >
      {avatar && (
        <div className="mb-1">
          {typeof avatar === 'string' ? (
            <img
              src={avatar}
              alt=""
              className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 shrink-0"
            />
          ) : (
            avatar
          )}
        </div>
      )}
      {icon && <div className="mb-1">{renderIcon()}</div>}
      {displayLabel && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-inter">
          {displayLabel}
        </span>
      )}
      {displayValue && (
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {displayValue}
        </h2>
      )}
      {subtext && (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{subtext}</p>
      )}
      {badge && <div className="pt-1">{badge}</div>}
    </div>
  );
};

export interface DetailGridProps {
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}


const DetailGrid: React.FC<DetailGridProps> = ({ cols = 2, children, className = '' }) => {
  const colClass =
    cols === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : cols === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';

  return <div className={`grid gap-2.5 ${colClass} ${className}`}>{children}</div>;
};

interface DetailsDrawerComponent extends React.FC<DetailsDrawerProps> {
  Row: typeof DetailRow;
  Section: typeof DetailSection;
  Hero: typeof DetailHero;
  Grid: typeof DetailGrid;
  Callout: typeof DetailCallout;
}

export const DetailsDrawer: DetailsDrawerComponent = ({
  isOpen,
  
  onClose,
  title,
  subtitle,
  icon,
  maxWidthClassName = 'max-w-2xl',
  isLoading = false,
  loadingMessage = 'Loading details...',
  isError = false,
  errorMessage,
  children,
  headerAction,
  footer,
  showDefaultFooter = true,
}) => {
  /** Locks background body scroll and registers ESC key listener when drawer is mounted */
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /** Resolves footer: custom footer -> smart default close button -> null */
  const renderedFooter =
    footer !== undefined ? (
      footer
    ) : showDefaultFooter ? (
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          Close
        </button>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Slide-over Panel */}
        <div
          className={`w-screen ${maxWidthClassName} bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out`}
        >
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              {icon && <div className="shrink-0">{icon}</div>}
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {headerAction}
              <button
                onClick={onClose}
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Loading State with AwoLoader */}
            {isLoading && (
              <div className="py-24 flex flex-col items-center justify-center">
                <AwoLoader size="sm" message={loadingMessage} />
              </div>
            )}

            {/* Error State */}
            {!isLoading && isError && (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <AlertCircle className="w-10 h-10 text-rose-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Unable to load details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {errorMessage || 'An error occurred while fetching details from the server.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            )}

            {/* Content View */}
            {!isLoading && !isError && children}
          </div>

          {/* Optional Footer */}
          {renderedFooter && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              {renderedFooter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export interface DetailCalloutProps {
  variant?: 'danger' | 'success' | 'warning' | 'info';
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const DetailCallout: React.FC<DetailCalloutProps> = ({
  variant = 'info',
  title,
  icon,
  children,
  footer,
  className = '',
}) => {
  const variantStyles = {
    danger:
      'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-800/40 text-rose-800 dark:text-rose-300',
    success:
      'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300',
    warning:
      'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-800/40 text-amber-800 dark:text-amber-300',
    info: 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/70 dark:border-blue-800/40 text-blue-800 dark:text-blue-300',
  }[variant];

  return (
    <div
      className={`p-3.5 rounded-xl border text-xs space-y-2 ${variantStyles} ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2 font-semibold">
          {icon}
          {title && <span>{title}</span>}
        </div>
      )}
      {children && <div>{children}</div>}
      {footer && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] opacity-80 pt-1 border-t border-current/10">
          {footer}
        </div>
      )}
    </div>
  );
};

// Compound subcomponents attachment
DetailsDrawer.Row = DetailRow;
DetailsDrawer.Section = DetailSection;
DetailsDrawer.Hero = DetailHero;
DetailsDrawer.Grid = DetailGrid;
DetailsDrawer.Callout = DetailCallout;



