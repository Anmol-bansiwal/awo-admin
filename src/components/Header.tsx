import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

interface PageMeta {
  title: string;
  description: string;
}

const EXACT_PAGE_MAP: Record<string, PageMeta> = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Overview of platform metrics and recent activities.',
  },
  '/customers': {
    title: 'Customer Management',
    description: 'Overview and account status management for registered customer accounts.',
  },
  '/providers': {
    title: 'Provider Management',
    description: 'Service provider verification, onboarding, and status oversight.',
  },
  '/bookings': {
    title: 'Booking Management',
    description: 'Monitor and manage platform service appointments and dispatch status.',
  },
  '/announcements': {
    title: 'Platform Announcements',
    description: 'Publish platform advisories, policy updates, and service announcements.',
  },
  '/notification-settings': {
    title: 'Notification Settings',
    description: 'Configure delivery channels (Email, SMS, Push, In-App) across event triggers.',
  },
  '/policies-content': {
    title: 'Policies & Static Content',
    description: 'Manage legal agreements, terms of service, and company informational documentation.',
  },
  '/transactions': {
    title: 'Transactions',
    description: 'Audit financial transaction logs and payment records.',
  },
  '/escrow': {
    title: 'Escrow Management',
    description: 'Oversight of customer escrow deposits and security holdings.',
  },
  '/payouts': {
    title: 'Provider Payouts',
    description: 'Process and review provider bank disbursements and earnings.',
  },
  '/refunds': {
    title: 'Refunds',
    description: 'Audit processed customer refunds and chargebacks.',
  },
  '/commission': {
    title: 'Commission Management',
    description: 'Configure platform fee rates and commission models.',
  },
  '/revenue-reports': {
    title: 'Revenue Reports',
    description: 'Financial performance analytics and revenue statements.',
  },
  '/complaints': {
    title: 'Customer Complaints',
    description: 'Investigate and resolve customer service complaints.',
  },
  '/disputes': {
    title: 'Provider Disputes',
    description: 'Review and mediate provider dispute cases and contract issues.',
  },
  '/refund-requests': {
    title: 'Refund Requests',
    description: 'Review, approve, or reject pending customer refund claims.',
  },
  '/escalations': {
    title: 'Escalation Cases',
    description: 'Critical high-priority cases requiring executive or legal review.',
  },
};

const PREFIX_PAGE_RULES: { prefix: string; meta: PageMeta }[] = [
  {
    prefix: '/customers/',
    meta: {
      title: 'Customer Profile',
      description: 'Detailed customer profile and account status management.',
    },
  },
  {
    prefix: '/providers/',
    meta: {
      title: 'Provider Profile',
      description: 'Detailed provider profile and verification status oversight.',
    },
  },
  {
    prefix: '/bookings/',
    meta: {
      title: 'Booking Details',
      description: 'Detailed booking and dispatch appointment overview.',
    },
  },
  {
    prefix: '/service-categories',
    meta: {
      title: 'Service Categories',
      description: 'Manage the service categories, icons, and status available on the platform.',
    },
  },
  {
    prefix: '/categories',
    meta: {
      title: 'Service Categories',
      description: 'Manage the service categories, icons, and status available on the platform.',
    },
  },
];

const DEFAULT_META: PageMeta = {
  title: 'AWO Admin Panel',
  description: 'Service management platform overview.',
};

const getPageHeaderInfo = (pathname: string): PageMeta => {
  if (EXACT_PAGE_MAP[pathname]) return EXACT_PAGE_MAP[pathname];
  const matchedRule = PREFIX_PAGE_RULES.find((r) => pathname.startsWith(r.prefix));
  return matchedRule ? matchedRule.meta : DEFAULT_META;
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const headerInfo = getPageHeaderInfo(location.pathname);

  return (
    <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile Sidebar Toggle + Dynamic Page Header */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {headerInfo.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            {headerInfo.description}
          </p>
        </div>
      </div>

      {/* Right: Quick Tools & Notification Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <ThemeToggle />
      </div>
    </header>
  );
};
