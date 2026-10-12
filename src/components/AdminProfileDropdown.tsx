import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrentAdminQuery } from '../hooks/useAuthMutations';

interface AdminProfileDropdownProps {
  isCollapsed?: boolean;
  isOpen?: boolean;
  hasAnyExpanded?: boolean;
  variant?: 'header' | 'sidebar';
}

const FALLBACK_NAME = 'Anmol Admin';
const FALLBACK_EMAIL = 'awoadmin@yopmail.com';

export const AdminProfileDropdown: React.FC<AdminProfileDropdownProps> = ({
  isCollapsed = false,
  isOpen = true,
  hasAnyExpanded = false,
  variant = 'sidebar',
}) => {
  const { user, logout } = useAuthStore();
  const { data: adminMeData } = useCurrentAdminQuery();
  const navigate = useNavigate();

  const currentAdmin = adminMeData?.data ?? user;

  const adminName = currentAdmin?.full_name ?? currentAdmin?.name ?? FALLBACK_NAME;
  const adminEmail = currentAdmin?.email ?? FALLBACK_EMAIL;
  const adminStatus = currentAdmin?.status ?? 'active';
  const isStatusActive = adminStatus === 'active';

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const toggleMenu = useCallback(() => setIsUserMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsUserMenuOpen(false), []);

  const handleLogout = useCallback(async () => {
    closeMenu();
    await logout();
    navigate('/login', { replace: true });
  }, [closeMenu, logout, navigate]);

  const showDetails = !isCollapsed || isOpen;

  const avatar = currentAdmin?.avatarUrl ? (
    <img
      src={currentAdmin.avatarUrl}
      alt={adminName}
      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/25 shadow-xs shrink-0"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center ring-2 ring-emerald-500/20 shrink-0 text-emerald-600 dark:text-emerald-400">
      <User className="w-4 h-4" />
    </div>
  );

  const menuDropdown = isUserMenuOpen && (
    <div
      role="menu"
      className={`origin-top-right absolute right-0 ${
        variant === 'header' ? 'top-full mt-2' : 'bottom-full mb-2'
      } w-56 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-700/80 z-50 p-1.5 animate-in fade-in ${
        variant === 'header' ? 'slide-in-from-top-2' : 'slide-in-from-bottom-2'
      } duration-150`}
    >
      <div className="px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl mb-1">
        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
          {adminName}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {adminEmail}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isStatusActive ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
          <span className="capitalize">{adminStatus}</span>
        </div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          role="menuitem"
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2.5 text-rose-500 dark:text-rose-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  if (variant === 'header') {
    return (
      <div ref={userMenuRef} className="relative flex items-center">
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isUserMenuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer focus:outline-none"
        >
          <div className="relative shrink-0">
            {avatar}
            {isStatusActive && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-2xs"
                title="Status: Active"
              />
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {adminName}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
              {adminEmail}
            </span>
          </div>
          <MoreVertical className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-0.5" />
        </button>
        {menuDropdown}
      </div>
    );
  }

  return (
    <div
      ref={userMenuRef}
      className={`relative p-3 border-t transition-colors duration-300 bg-transparent z-10 ${
        hasAnyExpanded
          ? 'border-emerald-500/15 dark:border-emerald-500/20'
          : 'border-slate-100 dark:border-slate-800/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isUserMenuOpen}
          aria-haspopup="menu"
          className={`flex items-center min-w-0 flex-1 text-left rounded-xl transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
            showDetails ? 'space-x-3 p-1.5 -ml-1' : 'justify-center p-1'
          }`}
        >
          <div className="relative shrink-0">
            {avatar}
            {isStatusActive && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-2xs"
                title="Status: Active"
              />
            )}
          </div>

          {showDetails && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {adminName}
              </span>
            </div>
          )}
        </button>

        <div className="relative shrink-0">
          {showDetails && (
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              aria-label="Account actions"
              title="Account actions"
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}

          {menuDropdown}
        </div>
      </div>
    </div>
  );
};
