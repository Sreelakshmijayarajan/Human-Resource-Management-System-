export * from './auth';
export * from './leave';
export * from './payroll';
export * from './reports';

export interface NavItem {
  label: string;
  path: string;
  icon: string; // icon name, resolved via switch in Sidebar
  badge?: number;
}

export type AttendanceStatus = 'not_checked_in' | 'checked_in' | 'checked_out';

export interface EmployeeData {
  id: string;
  name: string;
  firstName: string;
  role: string;
  department: string;
  email: string;
  avatarInitials: string;
  attendance: {
    status: AttendanceStatus;
    checkInTime: string | null;
    checkOutTime: string | null;
  };
  leaveBalance: {
    total: number;
    used: number;
    remaining: number;
  };
  pendingLeaveRequests: number;
  latestPayslip: {
    month: string;
    year: number;
    available: boolean;
  };
  notifications: {
    unread: number;
    items: Notification[];
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'leave' | 'payroll' | 'announcement' | 'attendance';
}
