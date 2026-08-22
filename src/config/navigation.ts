import React from 'react';
import { 
  LayoutDashboard, 
  UserRound, 
  Clock, 
  CalendarDays, 
  WalletCards, 
  Bell, 
  Users, 
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { UserRole } from '../types/auth';

export interface NavItemConfig {
  id: string;
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'notifications' | 'pendingLeave';
}

export const employeeNavItems: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/employee/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'profile',
    label: 'My Profile',
    route: '/employee/profile',
    icon: UserRound,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    route: '/employee/attendance',
    icon: Clock,
  },
  {
    id: 'leave',
    label: 'Leave',
    route: '/employee/leave',
    icon: CalendarDays,
    badgeKey: 'pendingLeave',
  },
  {
    id: 'payroll',
    label: 'Payroll',
    route: '/employee/payroll',
    icon: WalletCards,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    route: '/employee/notifications',
    icon: Bell,
    badgeKey: 'notifications',
  },
];

export const hrNavItems: NavItemConfig[] = [
  {
    id: 'hr-dashboard',
    label: 'Dashboard',
    route: '/hr/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'employees',
    label: 'Employee Management',
    route: '/hr/employees',
    icon: Users,
  },
  {
    id: 'hr-attendance',
    label: 'Attendance',
    route: '/hr/attendance',
    icon: Calendar,
  },
  {
    id: 'hr-leave',
    label: 'Leave Management',
    route: '/hr/leave',
    icon: FileText,
  },
  {
    id: 'hr-payroll',
    label: 'Payroll',
    route: '/hr/payroll',
    icon: DollarSign,
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    route: '/hr/reports',
    icon: BarChart3,
  },
  {
    id: 'hr-notifications',
    label: 'Notifications',
    route: '/hr/notifications',
    icon: Bell,
  },
  {
    id: 'roles',
    label: 'Role & Access',
    route: '/hr/roles',
    icon: Shield,
  },
  {
    id: 'settings',
    label: 'Settings',
    route: '/hr/settings',
    icon: Settings,
  },
];

export const getNavItemsByRole = (role: UserRole): NavItemConfig[] => {
  return role === 'hr_admin' ? hrNavItems : employeeNavItems;
};
