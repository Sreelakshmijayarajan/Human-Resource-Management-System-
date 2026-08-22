import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getNavItemsByRole } from '../../config/navigation';
import { UserRole } from '../../types/auth';
import { X } from 'lucide-react';

interface SidebarProps {
  role?: UserRole;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  role = 'hr_admin', 
  isMobileOpen = false, 
  onCloseMobile = () => {} 
}) => {
  const location = useLocation();
  const navItems = getNavItemsByRole(role);

  const renderNavContent = () => (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5">
      <div className="space-y-6">
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between md:hidden px-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              D
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">Dayflow</span>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check active (for /hr dashboard, handle /hr and /hr/dashboard)
            const isActive =
              item.route === '/hr/dashboard'
                ? location.pathname === '/hr' || location.pathname === '/hr/dashboard'
                : location.pathname === item.route || location.pathname.startsWith(item.route + '/');

            return (
              <NavLink
                key={item.id}
                to={item.route}
                onClick={onCloseMobile}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="pt-4 border-t border-slate-100/80 px-2 text-xs text-slate-400 font-medium">
        © 2026 Dayflow HRMS
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:block w-64 bg-white border-r border-slate-100/90 shrink-0 h-screen sticky top-0 z-20">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavContent()}
      </aside>
    </>
  );
};
