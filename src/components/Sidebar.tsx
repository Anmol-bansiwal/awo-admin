import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  LogOut,
  FolderTree,
  Calendar,
  X,
  CreditCard,
  BarChart3,
  Receipt,
  RotateCcw,
  ShieldCheck,
  ArrowUpRight,
  LifeBuoy,
  MessageSquareWarning,
  Scale,
  Flame,
  Percent,
  Bell,
  Megaphone,
  Sliders,
  FileText,
  Activity,
  Banknote,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrentAdminQuery } from '../hooks/useAuthMutations';
import { AwoLogo } from './AwoLoader';

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefixes?: string[];
}

interface NavGroupConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefixes: string[];
  items: NavItemConfig[];
}

const NAV_GROUPS: NavGroupConfig[] = [
  {
    id: 'user_management',
    label: 'User Management',
    icon: Users,
    matchPrefixes: ['/customers', '/providers'],
    items: [
      { to: '/customers', label: 'Customer', icon: Users },
      { to: '/providers', label: 'Provider', icon: UserCheck },
    ],
  },
  {
    id: 'financial_management',
    label: 'Financial Management',
    icon: CreditCard,
    matchPrefixes: [
      '/transactions',
      '/escrow',
      '/payouts',
      '/refunds',
      '/commission',
      '/revenue-reports',
    ],
    items: [
      { to: '/transactions', label: 'Transactions', icon: Receipt },
      { to: '/escrow', label: 'Escrow', icon: ShieldCheck },
      { to: '/payouts', label: 'Payouts', icon: ArrowUpRight },
      { to: '/refunds', label: 'Refunds', icon: RotateCcw },
      { to: '/commission', label: 'Commission', icon: Percent },
      { to: '/revenue-reports', label: 'Revenue Reports', icon: BarChart3 },
    ],
  },
  {
    id: 'complaints_disputes',
    label: 'Complaint & Disputes',
    icon: LifeBuoy,
    matchPrefixes: ['/complaints', '/disputes', '/refund-requests', '/escalations'],
    items: [
      { to: '/complaints', label: 'Customer Complaints', icon: MessageSquareWarning },
      { to: '/disputes', label: 'Provider Disputes', icon: Scale },
      { to: '/refund-requests', label: 'Refund Requests', icon: RotateCcw },
      { to: '/escalations', label: 'Escalation Cases', icon: Flame },
    ],
  },
  {
    id: 'notifications_content',
    label: 'Notifications & Content',
    icon: Bell,
    matchPrefixes: [
      '/announcements',
      '/notification-settings',
      '/service-categories',
      '/categories',
      '/policies-content',
    ],
    items: [
      { to: '/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/notification-settings', label: 'Notification Settings', icon: Sliders },
      {
        to: '/service-categories',
        label: 'Service Categories',
        icon: FolderTree,
        matchPrefixes: ['/service-categories', '/categories'],
      },
      { to: '/policies-content', label: 'Policies & Content', icon: FileText },
    ],
  },
  {
    id: 'analytics_reporting',
    label: 'Analytics & Reporting',
    icon: BarChart3,
    matchPrefixes: ['/analytics'],
    items: [
      { to: '/analytics', label: 'Overview', icon: BarChart3 },
      { to: '/analytics/user-growth', label: 'User Growth', icon: Users },
      { to: '/analytics/booking-trends', label: 'Booking Trends', icon: Calendar },
      { to: '/analytics/revenue', label: 'Revenue Performance', icon: Banknote },
      { to: '/analytics/provider-performance', label: 'Provider Performance', icon: UserCheck },
      { to: '/analytics/engagement', label: 'Platform Engagement', icon: Activity },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const { user, logout } = useAuthStore();
  const { data: adminMeData } = useCurrentAdminQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const currentAdmin = adminMeData?.data || user;
  const adminName = currentAdmin?.full_name || currentAdmin?.name || 'AWO Admin';
  const adminEmail = currentAdmin?.email || 'admin@example.com';
  const adminRole = currentAdmin?.role ? currentAdmin.role.toUpperCase() : 'ADMIN';
  const isStatusActive = currentAdmin?.status === 'active' || !currentAdmin?.status;

  // Track expanded state for accordion groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    user_management: true,
    financial_management: true,
    complaints_disputes: true,
    notifications_content: true,
    analytics_reporting: true,
  });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close user menu dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-expand active group when navigating
  useEffect(() => {
    NAV_GROUPS.forEach((group) => {
      const isGroupActive = group.matchPrefixes.some((prefix) =>
        location.pathname.startsWith(prefix)
      );
      if (isGroupActive) {
        setExpandedGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname]);

  const handleToggleGroup = (groupId: string) => {
    if (isCollapsed && !isOpen) {
      onToggleCollapse();
      setExpandedGroups((prev) => ({ ...prev, [groupId]: true }));
    } else {
      setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Navigation Rail Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#F8F9FA] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen max-h-screen justify-between transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[280px]'} w-[280px] shadow-lg lg:shadow-none`}
      >
        {/* TOP SECTION: Logo & Header + Scrollable Links */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="h-20 px-6 shrink-0 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <AwoLogo className="h-8 w-auto shrink-0" showDots={false} />
            </div>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NAVIGATION LINKS LIST */}
          <nav className="p-4 space-y-1.5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Dashboard Link */}
            <NavLink
              to="/dashboard"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
              title={isCollapsed && !isOpen ? 'Dashboard' : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#006E1C] dark:bg-emerald-500 rounded-r-full" />
                  )}
                  <LayoutDashboard
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isCollapsed && !isOpen ? 'mx-auto' : 'mr-3.5'
                    } ${isActive ? 'text-[#006E1C] dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}
                  />
                  {(!isCollapsed || isOpen) && <span className="truncate">Dashboard</span>}
                </>
              )}
            </NavLink>

            {/* User Management Accordion */}
            {NAV_GROUPS.slice(0, 1).map((group) => (
              <SidebarNavGroup
                key={group.id}
                group={group}
                isExpanded={Boolean(expandedGroups[group.id])}
                isCollapsed={isCollapsed}
                isOpen={isOpen}
                currentPath={location.pathname}
                onToggle={() => handleToggleGroup(group.id)}
                onCloseMobile={onCloseMobile}
              />
            ))}

            {/* Booking Management Standalone Link */}
            <div className="pt-1">
              <NavLink
                to="/bookings"
                onClick={onCloseMobile}
                className={({ isActive }) => {
                  const active = isActive || location.pathname.startsWith('/bookings');
                  return `flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    active
                      ? 'bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`;
                }}
                title={isCollapsed && !isOpen ? 'Booking Management' : undefined}
              >
                {({ isActive }) => {
                  const active = isActive || location.pathname.startsWith('/bookings');
                  return (
                    <>
                      {active && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#006E1C] dark:bg-emerald-500 rounded-r-full" />
                      )}
                      <Calendar
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isCollapsed && !isOpen ? 'mx-auto' : 'mr-3.5'
                        } ${active ? 'text-[#006E1C] dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}
                      />
                      {(!isCollapsed || isOpen) && <span className="truncate">Booking Management</span>}
                    </>
                  );
                }}
              </NavLink>
            </div>

            {/* Remaining Nav Groups: Financial, Complaints, Notifications */}
            {NAV_GROUPS.slice(1).map((group) => (
              <SidebarNavGroup
                key={group.id}
                group={group}
                isExpanded={Boolean(expandedGroups[group.id])}
                isCollapsed={isCollapsed}
                isOpen={isOpen}
                currentPath={location.pathname}
                onToggle={() => handleToggleGroup(group.id)}
                onCloseMobile={onCloseMobile}
              />
            ))}
          </nav>
        </div>

        {/* BOTTOM SECTION: User Profile & Actions Dropdown */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 relative" ref={userMenuRef}>
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center min-w-0 flex-1 ${
                isCollapsed && !isOpen ? 'justify-center' : 'space-x-3'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={
                    currentAdmin?.avatarUrl ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={adminName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
                />
                {isStatusActive && (
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                    title="Status: Active"
                  />
                )}
              </div>
              {(!isCollapsed || isOpen) && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {adminName}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40 uppercase tracking-wider">
                      {adminRole}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {(!isCollapsed || isOpen) && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
                  title="Account actions"
                  aria-label="Account actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-52 rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-700 z-50 py-1.5 focus:outline-none divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="px-3.5 py-2.5">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {adminName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {adminEmail}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="capitalize">{currentAdmin?.status || 'active'}</span>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2.5 text-rose-500 dark:text-rose-400" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

interface SidebarNavGroupProps {
  group: NavGroupConfig;
  isExpanded: boolean;
  isCollapsed: boolean;
  isOpen: boolean;
  currentPath: string;
  onToggle: () => void;
  onCloseMobile: () => void;
}

const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({
  group,
  isExpanded,
  isCollapsed,
  isOpen,
  currentPath,
  onToggle,
  onCloseMobile,
}) => {
  const isGroupActive = group.matchPrefixes.some((prefix) => currentPath.startsWith(prefix));
  const GroupIcon = group.icon;

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
          isGroupActive
            ? 'text-[#006E1C] dark:text-emerald-400 font-semibold bg-emerald-50/50 dark:bg-emerald-950/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
        title={isCollapsed && !isOpen ? group.label : undefined}
      >
        <div className="flex items-center min-w-0">
          <GroupIcon
            className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
              isCollapsed && !isOpen ? 'mx-auto' : 'mr-3.5'
            } ${isGroupActive ? 'text-[#006E1C] dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}
          />
          {(!isCollapsed || isOpen) && <span className="truncate">{group.label}</span>}
        </div>
        {(!isCollapsed || isOpen) && (
          <div className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        )}
      </button>

      {/* Children Sub-menu */}
      {isExpanded && (!isCollapsed || isOpen) && (
        <div className="mt-1 pl-9 space-y-1 border-l-2 border-slate-200/80 dark:border-slate-800 ml-5">
          {group.items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) => {
                  const active =
                    isActive ||
                    (item.matchPrefixes &&
                      item.matchPrefixes.some((p) => currentPath.startsWith(p)));
                  return `flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    active
                      ? 'bg-[#EAF7EC] dark:bg-emerald-950/40 text-[#006E1C] dark:text-emerald-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`;
                }}
              >
                <ItemIcon className="w-3.5 h-3.5 mr-2 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};
