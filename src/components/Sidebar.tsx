import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
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
import { AwoLogo } from './AwoLoader';
import { AdminProfileDropdown } from './AdminProfileDropdown';

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
  //     { to: '/analytics', label: 'Overview', icon: BarChart3 },
  //     { to: '/analytics/user-growth', label: 'User Growth', icon: Users },
  //     { to: '/analytics/booking-trends', label: 'Booking Trends', icon: Calendar },
  //     { to: '/analytics/revenue', label: 'Revenue Performance', icon: Banknote },
  //     { to: '/analytics/provider-performance', label: 'Provider Performance', icon: UserCheck },
  //     { to: '/analytics/engagement', label: 'Platform Engagement', icon: Activity },
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
  const location = useLocation();

  // Track expanded state for accordion groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    user_management: true,
    financial_management: true,
    complaints_disputes: true,
    notifications_content: true,
    analytics_reporting: true,
  });

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

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden cursor-pointer"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation Rail Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#F8F9FA] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen max-h-screen justify-between transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
                `flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group relative ${isActive
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
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isCollapsed && !isOpen ? 'mx-auto' : 'mr-3.5'
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
                  return `flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group relative ${active
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
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isCollapsed && !isOpen ? 'mx-auto' : 'mr-3.5'
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

        <AdminProfileDropdown isCollapsed={isCollapsed} isOpen={isOpen} />
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
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${isGroupActive
            ? 'text-[#006E1C] dark:text-emerald-400 font-semibold bg-emerald-50/50 dark:bg-emerald-950/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        title={isCollapsed && !isOpen ? group.label : undefined}
      >
        <div className="flex items-center min-w-0">
          <GroupIcon
            className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isCollapsed && !isOpen ? 'mx-auto' : 'mr-3.5'
              } ${isGroupActive ? 'text-[#006E1C] dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}
          />
          {(!isCollapsed || isOpen) && <span className="truncate">{group.label}</span>}
        </div>
        {(!isCollapsed || isOpen) && (
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        )}
      </button>

      {/* Children Sub-menu */}
      <AnimatePresence initial={false}>
        {isExpanded && (!isCollapsed || isOpen) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden mt-1 pl-9 space-y-1 border-l-2 border-slate-200/80 dark:border-slate-800 ml-5"
          >
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
                    return `flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${active
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
