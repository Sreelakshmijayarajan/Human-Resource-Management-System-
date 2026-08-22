import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Bell, 
  Shield, 
  Settings 
} from 'lucide-react';

export interface HRModuleConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  badge?: number;
  iconBg: string;
  iconColor: string;
}

export const hrModules: HRModuleConfig[] = [
  {
    id: 'employee-management',
    title: 'Employee Management',
    description: 'Profiles, documents, job records',
    icon: Users,
    route: '/hr/employees',
    iconBg: 'bg-indigo-50/80',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'attendance-management',
    title: 'Attendance Management',
    description: 'Track, correct & export records',
    icon: Calendar,
    route: '/hr/attendance',
    iconBg: 'bg-blue-50/80',
    iconColor: 'text-blue-600',
  },
  {
    id: 'leave-management',
    title: 'Leave Management',
    description: 'Approve, reject & set policy',
    icon: FileText,
    route: '/hr/leave',
    badge: 3,
    iconBg: 'bg-orange-50/80',
    iconColor: 'text-orange-600',
  },
  {
    id: 'payroll-management',
    title: 'Payroll Management',
    description: 'Salary structures & payslips',
    icon: DollarSign,
    route: '/hr/payroll',
    badge: 1,
    iconBg: 'bg-emerald-50/80',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'reports-analytics',
    title: 'Reports & Analytics',
    description: 'Trends & exportable reports',
    icon: BarChart3,
    route: '/hr/reports',
    iconBg: 'bg-purple-50/80',
    iconColor: 'text-purple-600',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Alerts & announcements',
    icon: Bell,
    route: '/hr/notifications',
    badge: 5,
    iconBg: 'bg-rose-50/80',
    iconColor: 'text-rose-600',
  },
  {
    id: 'role-access',
    title: 'Role & Access Control',
    description: 'Manage roles & permissions',
    icon: Shield,
    route: '/hr/roles',
    iconBg: 'bg-teal-50/80',
    iconColor: 'text-teal-600',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Departments, leave policies',
    icon: Settings,
    route: '/hr/settings',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
];
