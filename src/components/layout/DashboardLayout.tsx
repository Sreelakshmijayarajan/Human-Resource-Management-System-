import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { UserRole } from '../../types/auth';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  role?: UserRole;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role = 'employee' }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar */}
      <Sidebar
        role={role}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <Topbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/50">
          Dayflow HRMS &copy; 2026. Self-Service Portal for Enterprise Employees.
        </footer>
      </div>
    </div>
  );
};
