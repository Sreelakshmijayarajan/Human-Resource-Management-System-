import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { UserRole } from '../../types/auth';
import { AIChatbotWidget } from '../chat/AIChatbotWidget';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  role?: UserRole;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role = 'employee' }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200 relative">
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
        <footer className="py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          Dayflow HRMS &copy; 2026. Self-Service Portal for Enterprise Employees.
        </footer>
      </div>

      {/* Floating Dayflow AI Assistant Chatbot */}
      <AIChatbotWidget />
    </div>
  );
};

