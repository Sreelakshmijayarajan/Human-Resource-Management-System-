import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  DollarSign,
  BarChart2,
  Bell,
  Shield,
  Settings,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/hr', icon: LayoutDashboard, end: true },
  { name: 'Employee Management', path: '/hr/employees', icon: Users, end: false },
  { name: 'Attendance', path: '/hr/attendance', icon: Calendar, end: false },
  { name: 'Leave Management', path: '/hr/leave', icon: FileText, end: false },
  { name: 'Payroll', path: '/hr/payroll', icon: DollarSign, end: false },
  { name: 'Reports & Analytics', path: '/hr/reports', icon: BarChart2, end: false },
  { name: 'Notifications', path: '/hr/notifications', icon: Bell, end: false },
  { name: 'Role & Access', path: '/hr/roles', icon: Shield, end: false },
  { name: 'Settings', path: '/hr/settings', icon: Settings, end: false },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0">
      {/* Logo area */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <img src="/dayflow-icon.svg" alt="Dayflow" className="h-8 w-8" />
        <span className="text-lg font-bold text-indigo-600 tracking-tight">Dayflow</span>
      </div>

      <nav className="flex flex-col py-4 px-3 gap-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
