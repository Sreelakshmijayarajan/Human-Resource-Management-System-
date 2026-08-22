import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Sparkles,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  mockSummaryStats,
  mockAttendanceTrend,
  mockLeaveDistribution,
  mockDepartmentHeadcount,
  mockPayrollCostTrend,
} from '../../data/mockReports';
import {
  AttendanceTrendChart,
  LeaveDistributionChart,
  DepartmentHeadcountChart,
  PayrollCostChart,
} from '../../components/reports/ReportsCharts';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [selectedDept, setSelectedDept] = useState('all');
  const [reportType, setReportType] = useState('all');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    setToast({ id: `toast-${Date.now()}`, type, title, message: message || '' });
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  // Download single dataset as CSV helper
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    showToast('info', 'Preparing export...', `Generating ${filename} CSV dataset.`);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'Export Complete', `${filename}.csv downloaded successfully.`);
    }, 600);
  };

  const handleExportAttendance = () => {
    const headers = ['Date', 'Attendance_Percentage', 'Present_Count', 'Absent_Count', 'Late_Count'];
    const rows = mockAttendanceTrend.map((d) => [d.date, d.attendancePercentage, d.present, d.absent, d.late]);
    downloadCSV('Attendance_Trend_Report', headers, rows);
  };

  const handleExportLeave = () => {
    const headers = ['Leave_Type', 'Days_Taken', 'Percentage_Share'];
    const rows = mockLeaveDistribution.map((d) => [d.leaveType, d.count, d.percentage]);
    downloadCSV('Leave_Distribution_Report', headers, rows);
  };

  const handleExportHeadcount = () => {
    const headers = ['Department', 'Total_Headcount', 'Male_Employees', 'Female_Employees'];
    const rows = mockDepartmentHeadcount.map((d) => [d.department, d.count, d.maleCount, d.femaleCount]);
    downloadCSV('Department_Headcount_Report', headers, rows);
  };

  const handleExportPayrollCost = () => {
    const headers = ['Month', 'Gross_Payroll_Cost', 'Net_Salary_Payout', 'Bonus_Amount'];
    const rows = mockPayrollCostTrend.map((d) => [d.month, d.grossTotal, d.netTotal, d.bonus]);
    downloadCSV('Payroll_Cost_Trend_Report', headers, rows);
  };

  const handleExportFullReport = () => {
    showToast('info', 'Generating Full Organization Report...', 'Compiling all analytics modules into combined CSV payload.');
    setTimeout(() => {
      const fullCSV = [
        '=== DAYFLOW HRMS COMPREHENSIVE ORGANIZATIONAL REPORT ===',
        `Generated On: ${new Date().toLocaleDateString()}`,
        `Filters Applied - Range: ${dateRange}, Department: ${selectedDept}`,
        '',
        '--- SUMMARY METRICS ---',
        `Average Attendance Rate,${mockSummaryStats.avgAttendance}%`,
        `Total Leave Days Taken,${mockSummaryStats.totalLeaveDaysTaken} Days`,
        `Total Monthly Payroll Cost,INR ${mockSummaryStats.totalPayrollCost}`,
        `Headcount Growth Rate,+${mockSummaryStats.headcountGrowth}%`,
        '',
        '--- ATTENDANCE TREND DATA ---',
        'Date,Attendance_Percentage,Present,Absent,Late',
        ...mockAttendanceTrend.map((d) => `${d.date},${d.attendancePercentage}%,${d.present},${d.absent},${d.late}`),
        '',
        '--- LEAVE DISTRIBUTION DATA ---',
        'Leave_Type,Total_Days,Share_Percentage',
        ...mockLeaveDistribution.map((d) => `${d.leaveType},${d.count},${d.percentage}%`),
        '',
        '--- DEPARTMENT HEADCOUNT DATA ---',
        'Department,Total_Employees,Male,Female',
        ...mockDepartmentHeadcount.map((d) => `${d.department},${d.count},${d.maleCount},${d.femaleCount}`),
        '',
        '--- PAYROLL EXPENDITURE TREND ---',
        'Month,Gross_Cost,Net_Payout,Bonus',
        ...mockPayrollCostTrend.map((d) => `${d.month},INR ${d.grossTotal},INR ${d.netTotal},INR ${d.bonus}`),
      ].join('\n');

      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + fullCSV);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Dayflow_Full_HR_Report_${dateRange}_${selectedDept}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'Full Report Exported', 'Comprehensive CSV document generated.');
    }, 1000);
  };

  const departments = ['all', 'Engineering', 'Human Resources', 'Marketing', 'Finance', 'Design', 'Analytics', 'Sales'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Reports & Analytics <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data-driven HR insights on attendance rates, leave distribution, headcount growth, and payroll expenditure.
          </p>
        </div>

        <button
          onClick={handleExportFullReport}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4" /> Export Full Report (.CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Report Dashboard Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Date Range Picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
            >
              <option value="month">This Month (Aug 2026)</option>
              <option value="quarter">Last Quarter (Q2 2026)</option>
              <option value="ytd">Year to Date (2026)</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <BarChart3 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer capitalize"
            >
              <option value="all">All Metrics</option>
              <option value="attendance">Attendance</option>
              <option value="leave">Leave</option>
              <option value="headcount">Headcount</option>
              <option value="payroll">Payroll</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Attendance Rate</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{mockSummaryStats.avgAttendance}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leave Days Taken</span>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{mockSummaryStats.totalLeaveDaysTaken} Days</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <PieIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Payroll</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{formatCurrency(mockSummaryStats.totalPayrollCost)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Headcount Growth</span>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">+{mockSummaryStats.headcountGrowth}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Chart Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(reportType === 'all' || reportType === 'attendance') && (
          <AttendanceTrendChart data={mockAttendanceTrend} onExport={handleExportAttendance} />
        )}

        {(reportType === 'all' || reportType === 'leave') && (
          <LeaveDistributionChart data={mockLeaveDistribution} onExport={handleExportLeave} />
        )}

        {(reportType === 'all' || reportType === 'headcount') && (
          <DepartmentHeadcountChart data={mockDepartmentHeadcount} onExport={handleExportHeadcount} />
        )}

        {(reportType === 'all' || reportType === 'payroll') && (
          <PayrollCostChart data={mockPayrollCostTrend} onExport={handleExportPayrollCost} />
        )}
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
