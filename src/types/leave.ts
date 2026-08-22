export type LeaveType = 'sick' | 'casual' | 'earned' | 'unpaid' | 'maternity_paternity';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  appliedOn: string;
  status: LeaveStatus;
  rejectionReason?: string;
  approvedBy?: string;
  approvedOn?: string;
}

export interface LeavePolicy {
  id: string;
  name: string;
  type: LeaveType;
  annualQuota: number;
  carryForwardAllowed: boolean;
  maxCarryForwardDays: number;
  accrualMethod: 'monthly' | 'yearly';
  applicableEmploymentTypes: string[];
}
