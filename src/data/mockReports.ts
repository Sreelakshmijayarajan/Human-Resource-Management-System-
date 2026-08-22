import {
  AttendanceTrendPoint,
  LeaveDistributionItem,
  DepartmentHeadcount,
  PayrollCostTrendPoint,
  ReportSummaryStats,
} from '../types/reports';

export const mockSummaryStats: ReportSummaryStats = {
  avgAttendance: 94.8,
  totalLeaveDaysTaken: 142,
  totalPayrollCost: 1541000,
  headcountGrowth: 12.5,
};

export const mockAttendanceTrend: AttendanceTrendPoint[] = [
  { date: 'Aug 01', attendancePercentage: 96.2, present: 48, absent: 2, late: 1 },
  { date: 'Aug 04', attendancePercentage: 94.0, present: 47, absent: 3, late: 2 },
  { date: 'Aug 07', attendancePercentage: 98.0, present: 49, absent: 1, late: 0 },
  { date: 'Aug 10', attendancePercentage: 92.5, present: 46, absent: 4, late: 3 },
  { date: 'Aug 13', attendancePercentage: 95.8, present: 48, absent: 2, late: 1 },
  { date: 'Aug 16', attendancePercentage: 91.0, present: 45, absent: 5, late: 2 },
  { date: 'Aug 19', attendancePercentage: 97.5, present: 49, absent: 1, late: 1 },
  { date: 'Aug 22', attendancePercentage: 95.0, present: 47, absent: 2, late: 2 },
];

export const mockLeaveDistribution: LeaveDistributionItem[] = [
  { leaveType: 'Sick Leave', count: 48, percentage: 33.8, color: '#3b82f6' }, // blue
  { leaveType: 'Casual Leave', count: 42, percentage: 29.6, color: '#a855f7' }, // purple
  { leaveType: 'Earned Leave', count: 35, percentage: 24.6, color: '#14b8a6' }, // teal
  { leaveType: 'Unpaid Leave', count: 12, percentage: 8.5, color: '#64748b' }, // gray
  { leaveType: 'Maternity/Paternity', count: 5, percentage: 3.5, color: '#ec4899' }, // pink
];

export const mockDepartmentHeadcount: DepartmentHeadcount[] = [
  { department: 'Engineering', count: 18, maleCount: 12, femaleCount: 6 },
  { department: 'Human Resources', count: 6, maleCount: 2, femaleCount: 4 },
  { department: 'Design', count: 5, maleCount: 2, femaleCount: 3 },
  { department: 'Marketing', count: 7, maleCount: 4, femaleCount: 3 },
  { department: 'Finance', count: 4, maleCount: 2, femaleCount: 2 },
  { department: 'Analytics', count: 5, maleCount: 3, femaleCount: 2 },
  { department: 'Sales', count: 8, maleCount: 5, femaleCount: 3 },
];

export const mockPayrollCostTrend: PayrollCostTrendPoint[] = [
  { month: 'Mar 2026', grossTotal: 1380000, netTotal: 1210000, bonus: 50000 },
  { month: 'Apr 2026', grossTotal: 1420000, netTotal: 1245000, bonus: 45000 },
  { month: 'May 2026', grossTotal: 1450000, netTotal: 1270000, bonus: 60000 },
  { month: 'Jun 2026', grossTotal: 1490000, netTotal: 1305000, bonus: 55000 },
  { month: 'Jul 2026', grossTotal: 1541000, netTotal: 1349100, bonus: 70000 },
  { month: 'Aug 2026 (Est)', grossTotal: 1560000, netTotal: 1365000, bonus: 65000 },
];
