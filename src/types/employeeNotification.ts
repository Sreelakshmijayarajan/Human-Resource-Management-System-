import { LeaveStatus } from './leave';

export interface EmployeeNotification {
  id: string;
  type: 'leave' | 'announcement' | 'payroll' | 'attendance';
  title: string;
  message: string;
  time: string;
  read: boolean;
  leaveStatus?: LeaveStatus;
  leaveId?: string;
  sender?: string;
}
