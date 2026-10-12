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
  icon?: React.ComponentType<{ className?: string }>;
  matchPrefixes?: string[];
  end?: boolean;
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
    label: 'USER MANAGEMENT',
    icon: Users,
    matchPrefixes: ['/customers', '/providers'],
    items: [
      { to: '/customers', label: 'Customers', icon: Users },
      { to: '/providers', label: 'Providers', icon: UserCheck },
    ],
  },
  {
    id: 'booking_management',
    label: 'BOOKING MANAGEMENT',
    icon: Calendar,
    matchPrefixes: ['/bookings'],
    items: [
      { to: '/bookings', label: 'All Bookings', icon: Calendar },
    ],
  },
  {
    id: 'financial_management',
    label: 'FINANCIAL MANAGEMENT',
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
      { to: '/payouts', label: 'Pay-outs', icon: ArrowUpRight },
      { to: '/refunds', label: 'Refunds', icon: RotateCcw },
      { to: '/commission', label: 'Commissions', icon: Percent },
      { to: '/revenue-reports', label: 'Revenue Reports', icon: BarChart3 },
    ],
  },
  {
    id: 'complaints_disputes',
    label: 'COMPLAINT & DISPUTES',
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
    label: 'NOTIFICATION & CONTENT',
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
    label: 'ANALYTICS & REPORTING',
    
    icon: BarChart3,
    matchPrefixes: ['/analytics'],
    items: [
      { to: '/analytics', label: 'Overview', icon: BarChart3, end: true },
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
  const location = useLocation();

  // Track active expanded module (mutual exclusivity - only one open at a time)
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(() => {
    const matched = NAV_GROUPS.find((group) =>
      group.matchPrefixes.some((prefix) => location.pathname.startsWith(prefix))
    );
    return matched ? matched.id : null;
  });

  // Auto-expand active group when navigating
  useEffect(() => {
    const matched = NAV_GROUPS.find((group) =>
      group.matchPrefixes.some((prefix) => location.pathname.startsWith(prefix))
    );
    if (matched) {
      setExpandedGroupId(matched.id);
    } else if (location.pathname === '/dashboard') {
      setExpandedGroupId(null);
    }
  }, [location.pathname]);

  const handleToggleGroup = (groupId: string) => {
    if (isCollapsed && !isOpen) {
      onToggleCollapse();
      setExpandedGroupId(groupId);
    } else {
      setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
    }
  };

  const hasAnyExpanded = Boolean(expandedGroupId);

  const handleSingleItemClick = () => {
    setExpandedGroupId(null);
    onCloseMobile();
  };

  const renderNavGroup = (group: NavGroupConfig) => (
    <SidebarNavGroup
      key={group.id}
      group={group}
      isExpanded={expandedGroupId === group.id}
      isCollapsed={isCollapsed}
      isOpen={isOpen}
      currentPath={location.pathname}
      onToggle={() => handleToggleGroup(group.id)}
      onCloseMobile={onCloseMobile}
    />
  );

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
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-screen max-h-screen justify-between transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[280px]'} w-[280px] ${
          hasAnyExpanded
            ? 'shadow-[4px_0_24px_-4px_rgba(56,180,73,0.16)] lg:shadow-[2px_0_20px_-2px_rgba(56,180,73,0.12)]'
            : 'shadow-lg lg:shadow-[1px_0_12px_rgba(0,0,0,0.02)]'
        }`}
      >
        {/* Ambient greenish shadow starting from the left to the right when any module is toggled */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/[0.12] via-emerald-500/[0.04] to-transparent dark:from-emerald-500/[0.18] dark:via-emerald-500/[0.06] to-transparent transition-opacity duration-500 ${
            hasAnyExpanded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-40 shadow-[inset_28px_0_32px_-12px_rgba(56,180,73,0.22)] dark:shadow-[inset_28px_0_32px_-12px_rgba(85,219,84,0.25)] transition-opacity duration-500 ${
            hasAnyExpanded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 -left-12 w-48 bg-emerald-500/[0.10] dark:bg-emerald-500/[0.15] blur-3xl transition-opacity duration-700 ${
            hasAnyExpanded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* TOP SECTION: Logo & Header + Search + Scrollable Links */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative z-10">
          <div
            className={`h-20 shrink-0 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80 transition-all duration-300 ease-in-out relative`}
          >
            <div
              className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed && !isOpen
                  ? 'lg:max-w-0 lg:opacity-0 lg:-translate-x-2'
                  : 'max-w-[160px] opacity-100 translate-x-0'
              }`}
            >
              <AwoLogo className="h-8 w-auto shrink-0" showDots={false} />
            </div>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ease-in-out cursor-pointer ${
                isCollapsed && !isOpen ? 'lg:absolute lg:left-1/2 lg:-translate-x-1/2' : ''
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          {/* NAVIGATION LINKS LIST */}
          <nav className="p-3.5 space-y-1 flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Dashboard Link */}
            <SidebarSingleItem
              to="/dashboard"
              label="DASHBOARD"
              icon={LayoutDashboard}
              isCollapsed={isCollapsed}
              isOpen={isOpen}
              onClick={handleSingleItemClick}
            />

            {/* Accordion Module Groups */}
            {NAV_GROUPS.map(renderNavGroup)}
          </nav>
        </div>

        {/* Bottom Profile dropdown (visible on mobile / fallback) */}
        <div className="lg:hidden">
          <AdminProfileDropdown
            isCollapsed={isCollapsed}
            isOpen={isOpen}
            hasAnyExpanded={hasAnyExpanded}
          />
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
    <div
      className={`transition-all duration-300 ease-in-out rounded-xl ${
        isExpanded && (!isCollapsed || isOpen)
          ? 'bg-emerald-50/50 dark:bg-emerald-950/25 shadow-[0_4px_16px_-2px_rgba(56,180,73,0.12)] ring-1 ring-emerald-500/20 my-1 pb-1'
          : 'my-0.5'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center rounded-xl transition-all duration-300 ease-in-out group cursor-pointer ${
          isCollapsed && !isOpen ? 'px-0 py-2.5 justify-center' : 'px-3.5 py-2.5 justify-between'
        } ${
          isGroupActive
            ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/20'
            : isExpanded && (!isCollapsed || isOpen)
            ? 'text-emerald-900 dark:text-emerald-200'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
        }`}
        title={isCollapsed && !isOpen ? group.label : undefined}
      >
        <div className={`flex items-center min-w-0 ${isCollapsed && !isOpen ? 'justify-center' : ''}`}>
          <GroupIcon
            className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105 ${
              isGroupActive || (isExpanded && (!isCollapsed || isOpen))
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
            }`}
          />
          <span
            className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap font-['DM_Sans',sans-serif] font-semibold text-[11.2px] leading-[120%] tracking-[0.04em] uppercase ${
              isCollapsed && !isOpen
                ? 'max-w-0 opacity-0 pointer-events-none'
                : 'max-w-[160px] opacity-100 ml-3'
            }`}
          >
            {group.label}
          </span>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isCollapsed && !isOpen ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-6 opacity-100 ml-auto'
          }`}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className={`transition-colors ${
              isGroupActive || isExpanded
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </button>

      {/* Children Sub-menu */}
      <AnimatePresence initial={false}>
        {isExpanded && (!isCollapsed || isOpen) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden mt-1 pl-4 ml-4.5 space-y-0.5 border-l border-emerald-500/25 dark:border-emerald-500/30"
          >
            {group.items.map((item) => {
              const isMatch = Boolean(item.matchPrefixes?.some((p) => currentPath.startsWith(p)));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) => {
                    const active = isActive || isMatch;
                    return `flex items-center px-3 py-1.5 rounded-lg transition-all duration-150 group/sub ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/20 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                    }`;
                  }}
                >
                  <span className="truncate font-['DM_Sans',sans-serif] font-medium text-[11.2px] leading-[120%] tracking-[0.02em]">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SidebarSingleItemProps {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isCollapsed: boolean;
  isOpen: boolean;
  onClick: () => void;
  matchPrefix?: string;
}

const SidebarSingleItem: React.FC<SidebarSingleItemProps> = ({
  to,
  label,
  icon: Icon,
  isCollapsed,
  isOpen,
  onClick,
  matchPrefix,
}) => {
  const location = useLocation();

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => {
        const active = isActive || (matchPrefix ? location.pathname.startsWith(matchPrefix) : false);
        return `flex items-center rounded-xl transition-all duration-300 ease-in-out group relative ${
          isCollapsed && !isOpen ? 'px-0 py-2.5 justify-center' : 'px-3.5 py-2.5'
        } ${
          active
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/25 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`;
      }}
      title={isCollapsed && !isOpen ? label : undefined}
    >
      {({ isActive }) => {
        const active = isActive || (matchPrefix ? location.pathname.startsWith(matchPrefix) : false);
        return (
          <>
            {active && (
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full shadow-xs" />
            )}
            <div className={`flex items-center min-w-0 ${isCollapsed && !isOpen ? 'justify-center' : ''}`}>
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  active
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              />
              <span
                className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap font-['DM_Sans',sans-serif] font-semibold text-[11.2px] leading-[120%] tracking-[0.04em] uppercase ${
                  isCollapsed && !isOpen
                    ? 'max-w-0 opacity-0 pointer-events-none'
                    : 'max-w-[160px] opacity-100 ml-3'
                }`}
              >
                {label}
              </span>
            </div>
          </>
        );
      }}
    </NavLink>
  );
};
