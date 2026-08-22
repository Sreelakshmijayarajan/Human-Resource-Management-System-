import { LeaveType, LeaveStatus } from './leave';

export interface MyLeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export interface MyLeaveRequest {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  rejectionReason?: string;
  approvedBy?: string;
  attachmentName?: string;
}
