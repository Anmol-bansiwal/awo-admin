import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'icon';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'pill',
}) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative p-2.5 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          isDark
            ? 'bg-slate-800 text-amber-300 hover:bg-slate-700/80 hover:text-amber-200 border border-slate-700/60 shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200 shadow-xs'
        } ${className}`}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          {/* Sun Icon */}
          <Sun
            className={`w-5 h-5 transition-all duration-300 transform ${
              isDark
                ? 'rotate-90 scale-0 opacity-0 absolute'
                : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          {/* Moon Icon */}
          <Moon
            className={`w-5 h-5 transition-all duration-300 transform ${
              isDark
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0 absolute'
            }`}
          />
        </div>
      </button>
    );
  }

  // Default: Modern Interactive Pill Slider Toggle
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 select-none items-center ${
        isDark
          ? 'bg-slate-800 border border-slate-700 shadow-inner'
          : 'bg-slate-200 border border-slate-300/80 shadow-inner'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode (currently Dark)' : 'Switch to dark mode (currently Light)'}
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none text-slate-400">
        <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-40 text-slate-400' : 'opacity-0'}`} />
        <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDark ? 'opacity-0' : 'opacity-40 text-slate-500'}`} />
      </div>

      {/* Animated Sliding Thumb */}
      <span
        className={`pointer-events-none flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition duration-300 ease-in-out z-10 ${
          isDark
            ? 'translate-x-7 bg-slate-900 text-amber-300 ring-1 ring-slate-700'
            : 'translate-x-0 bg-white text-amber-500 ring-1 ring-slate-200'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-amber-300/20 text-amber-300 animate-in fade-in zoom-in-75 duration-200" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 animate-in fade-in zoom-in-75 duration-200" />
        )}
      </span>
    </button>
  );
};
