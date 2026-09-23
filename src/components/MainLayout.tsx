import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';


export const MainLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [, setIsNewBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar Rail / Overlay */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        isCollapsed={isDesktopCollapsed}
        onToggleCollapse={() => setIsDesktopCollapsed((prev) => !prev)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area Offset by Desktop Sidebar Width */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isDesktopCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[280px]'
          }`}
      >
        {/* Top Header Bar */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Page Outlet Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet context={{ onOpenNewBooking: () => setIsNewBookingModalOpen(true) }} />
        </main>
      </div>
    </div>
  );
};

