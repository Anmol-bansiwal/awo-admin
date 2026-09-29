import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrentAdminQuery } from '../hooks/useAuthMutations';

interface AdminProfileDropdownProps {
  isCollapsed: boolean;
  isOpen: boolean;
}

const FALLBACK_NAME = 'AWO Admin';
const FALLBACK_EMAIL = 'admin@example.com';
const FALLBACK_ROLE = 'ADMIN';

export const AdminProfileDropdown: React.FC<AdminProfileDropdownProps> = ({
  isCollapsed,
  isOpen,
}) => {
  const { user, logout } = useAuthStore();
  const { data: adminMeData } = useCurrentAdminQuery();
  const navigate = useNavigate();

  const currentAdmin = adminMeData?.data ?? user;

  const adminName = currentAdmin?.full_name ?? currentAdmin?.name ?? FALLBACK_NAME;
  const adminEmail = currentAdmin?.email ?? FALLBACK_EMAIL;
  const adminRole = (currentAdmin?.role ?? FALLBACK_ROLE).toUpperCase();
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
      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center ring-2 ring-emerald-500/30 shrink-0 text-emerald-600 dark:text-emerald-400">
      <User className="w-5 h-5" />
    </div>
  );

  return (
    <div
      ref={userMenuRef}
      className="relative p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90"
    >
      <div className="flex items-center justify-between">
        {/* Identity button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isUserMenuOpen}
          aria-haspopup="menu"
          className={`flex items-center min-w-0 flex-1 text-left rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
            showDetails ? 'space-x-3 p-1.5 -ml-1.5' : 'justify-center p-1'
          }`}
        >
          <div className="relative shrink-0">
            {avatar}
            {isStatusActive && (
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                title="Status: Active"
              />
            )}
          </div>

          {showDetails && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {adminName}
              </span>
              <span className="self-start mt-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40 uppercase tracking-wider">
                {adminRole}
              </span>
            </div>
          )}
        </button>

        {/* Actions */}
        <div className="relative shrink-0">
          {showDetails && (
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              aria-label="Account actions"
              title="Account actions"
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}

          {isUserMenuOpen && (
            <div
              role="menu"
              className="origin-bottom-right absolute right-0 bottom-full mb-2 w-52 rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-700 z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150"
            >
              <div className="px-3.5 py-2.5">
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

              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2.5 text-rose-500 dark:text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDropdown;