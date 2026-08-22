import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getNavItemsByRole } from '../../config/navigation';
import { UserRole } from '../../types/auth';
import { useAppContext } from '../../context/AppContext';
import { X, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  role?: UserRole;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role = 'employee', isMobileOpen = false, onCloseMobile = () => {} }) => {
  const location = useLocation();
  const { employeeData } = useAppContext();
  const navItems = getNavItemsByRole(role);

  const isEmployee = role === 'employee';

  const getBadgeValue = (badgeKey?: string) => {
    if (badgeKey === 'notifications') return employeeData.notifications.unread;
    if (badgeKey === 'pendingLeave') return employeeData.pendingLeaveRequests;
    return undefined;
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              D
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-none">Dayflow</div>
              <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                {isEmployee ? 'Employee Self-Service' : 'HR & Management'}
              </div>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Label */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.route;
              const badge = getBadgeValue(item.badgeKey);

              return (
                <NavLink
                  key={item.id}
                  to={item.route}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? isEmployee
                        ? 'bg-teal-500/10 text-teal-700 font-bold border border-teal-200/50'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? isEmployee
                            ? 'text-teal-600'
                            : 'text-white'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {badge !== undefined && badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? isEmployee
                            ? 'bg-teal-600 text-white'
                            : 'bg-white text-blue-600'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <div className="text-[11px] leading-tight">
            <p className="font-semibold text-slate-800">Odoo Dayflow Engine</p>
            <p className="text-slate-400 text-[10px]">v2026.1 Enterprise</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:block w-64 bg-white border-r border-slate-100 shrink-0 h-screen sticky top-0 z-20">
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
