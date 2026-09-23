import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pill';
  showClear?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  size = 'md',
  variant = 'default',
  showClear = true,
  disabled = false,
  autoFocus = false,
}) => {
  const sizeStyles = {
    sm: 'py-1.5 pl-8 pr-7 text-xs',
    md: 'py-2.5 pl-9 pr-8 text-xs',
    lg: 'py-3 pl-10 pr-9 text-sm',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3',
    lg: 'w-4.5 h-4.5 left-3.5',
  }[size];

  const roundedStyle = variant === 'pill' ? 'rounded-full' : 'rounded-xl';

  return (
    <div className={`relative w-full ${className}`}>
      <Search
        className={`text-slate-400 dark:text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none shrink-0 ${iconSizes}`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/30 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all ${roundedStyle} ${sizeStyles} ${inputClassName}`}
      />
      {showClear && value && !disabled && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Clear search"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

