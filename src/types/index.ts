export * from './auth';
export * from './leave';
export * from './payroll';
export * from './reports';
export * from './employeeLeave';
export * from './employeePayroll';
export * from './employeeNotification';

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

export interface EmployeeDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image';
  size: string;
  uploadedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: 'Engineering' | 'Product & Design' | 'Human Resources' | 'Finance' | string;
  designation: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern' | string;
  status: 'active' | 'on_leave' | 'inactive';
  dateOfJoining: string;
  avatarInitials: string;
  avatarColor: string;
  address?: string;
  gender?: 'Male' | 'Female' | 'Other';
  documents: EmployeeDocument[];
}

export interface CorrectionEntry {
  id: string;
  correctedBy: string;
  correctedAt: string;
  oldStatus: string;
  newStatus: string;
  reason: string;
  oldCheckIn?: string | null;
  oldCheckOut?: string | null;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  avatarColor: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: string | null; // Using string for "9h 13m" format for display
  status: 'present' | 'absent' | 'half_day' | 'on_leave' | 'holiday' | 'late';
  correctionHistory: CorrectionEntry[];
}
