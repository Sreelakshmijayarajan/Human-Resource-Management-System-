import { 
  LayoutDashboard, 
  UserRound, 
  Clock, 
  CalendarDays, 
  WalletCards, 
  Bell, 
  Users, 
  FileText 
} from 'lucide-react';
import { UserRole } from '../types/auth';

export interface NavItemConfig {
  id: string;
  label: string;
  route: string;
  icon: React.ElementType;
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
    label: 'Employees',
    route: '/hr/employees',
    icon: Users,
  },
  {
    id: 'hr-attendance',
    label: 'Attendance Records',
    route: '/hr/attendance',
    icon: Clock,
  },
  {
    id: 'hr-leave',
    label: 'Leave Approvals',
    route: '/hr/leave',
    icon: CalendarDays,
  },
  {
    id: 'hr-payroll',
    label: 'Payroll Management',
    route: '/hr/payroll',
    icon: WalletCards,
  },
  {
    id: 'reports',
    label: 'Reports & Docs',
    route: '/hr/reports',
    icon: FileText,
  },
];

export const getNavItemsByRole = (role: UserRole): NavItemConfig[] => {
  return role === 'hr_admin' ? hrNavItems : employeeNavItems;
};
