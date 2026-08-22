export interface AttendanceTrendPoint {
  date: string;
  attendancePercentage: number;
  present: number;
  absent: number;
  late: number;
}

export interface LeaveDistributionItem {
  leaveType: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DepartmentHeadcount {
  department: string;
  count: number;
  maleCount: number;
  femaleCount: number;
}

export interface PayrollCostTrendPoint {
  month: string;
  grossTotal: number;
  netTotal: number;
  bonus: number;
}

export interface ReportSummaryStats {
  avgAttendance: number;
  totalLeaveDaysTaken: number;
  totalPayrollCost: number;
  headcountGrowth: number;
}
