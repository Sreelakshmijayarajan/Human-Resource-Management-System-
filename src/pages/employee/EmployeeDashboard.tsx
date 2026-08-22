import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserRound, 
  Clock, 
  CalendarDays, 
  WalletCards, 
  Bell, 
  CheckCircle2, 
  CalendarCheck,
  FileCheck
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { StatusCard } from '../../components/dashboard/StatusCard';
import { ModuleCard } from '../../components/dashboard/ModuleCard';
import { DashboardSkeleton } from '../../components/ui/Skeletons';
import { Button } from '../../components/ui/Button';

export const employeeModulesConfig = [
  {
    id: 'profile',
    title: 'My Profile',
    description: 'Personal details, emergency contacts, and employment documents',
    icon: UserRound,
    route: '/employee/profile',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    description: 'Check in/out, view timesheets, and review monthly work logs',
    icon: Clock,
    route: '/employee/attendance',
  },
  {
    id: 'leave',
    title: 'Leave',
    description: 'Apply for time off, check leave balance, and track approvals',
    icon: CalendarDays,
    route: '/employee/leave',
  },
  {
    id: 'payroll',
    title: 'Payroll & Payslips',
    description: 'View monthly payslips, tax breakdowns, and salary slips',
    icon: WalletCards,
    route: '/employee/payroll',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Company announcements, leave status updates, and alerts',
    icon: Bell,
    route: '/employee/notifications',
  },
];

export const EmployeeDashboard: React.FC = () => {
  const { user, employeeData, updateAttendance } = useAppContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingCheckAction, setIsProcessingCheckAction] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const attendance = employeeData.attendance;

  const handleCheckInToggle = () => {
    setIsProcessingCheckAction(true);
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setTimeout(() => {
      if (attendance.status === 'not_checked_in') {
        updateAttendance('checked_in', nowTime);
        setFeedbackMessage(`Checked in successfully at ${nowTime}`);
      } else if (attendance.status === 'checked_in') {
        updateAttendance('checked_out', nowTime);
        setFeedbackMessage(`Checked out successfully at ${nowTime}`);
      }
      setIsProcessingCheckAction(false);

      setTimeout(() => setFeedbackMessage(null), 4000);
    }, 800);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const { total, used, remaining } = employeeData.leaveBalance;
  const leavePercentage = Math.round((used / total) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Personalized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.firstName || employeeData.firstName}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
            <span>{todayFormatted}</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md text-xs">
              Here's your workday at a glance.
            </span>
          </p>
        </div>

        {/* Feedback Alert Toast if just checked in/out */}
        {feedbackMessage && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl animate-slide-up shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Quick Status Row (4 Cards) */}
      <section aria-label="Daily Status Summary" className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Daily Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Attendance Status */}
          <StatusCard
            title="Attendance"
            subtitle="Today's Log"
            icon={Clock}
            iconBgColor={
              attendance.status === 'checked_in'
                ? 'bg-teal-50 text-teal-600'
                : attendance.status === 'checked_out'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-slate-100 text-slate-500'
            }
            value={
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {attendance.status === 'checked_in'
                    ? 'Checked In'
                    : attendance.status === 'checked_out'
                    ? 'Checked Out'
                    : 'Not Checked In'}
                </span>
                <span className="text-xs font-semibold text-teal-600 mt-0.5">
                  {attendance.status === 'checked_in'
                    ? `Since ${attendance.checkInTime}`
                    : attendance.status === 'checked_out'
                    ? `Out at ${attendance.checkOutTime}`
                    : 'Ready for shift'}
                </span>
              </div>
            }
            action={
              attendance.status === 'checked_out' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-slate-100 text-slate-600 rounded-lg">
                  <CalendarCheck className="w-3.5 h-3.5" /> Done
                </span>
              ) : (
                <Button
                  size="sm"
                  variant={attendance.status === 'checked_in' ? 'secondary' : 'primary'}
                  isLoading={isProcessingCheckAction}
                  loadingText="Saving..."
                  onClick={handleCheckInToggle}
                  className={
                    attendance.status === 'not_checked_in'
                      ? '!bg-teal-600 hover:!bg-teal-700 focus:!ring-teal-500 shadow-teal-500/20 text-white font-bold px-4'
                      : '!bg-slate-200 hover:!bg-slate-300 text-slate-800 font-bold px-4'
                  }
                >
                  {attendance.status === 'not_checked_in' ? 'Check In' : 'Check Out'}
                </Button>
              )
            }
            footer={
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Shift: 09:00 AM - 06:00 PM</span>
                <button
                  onClick={() => navigate('/employee/attendance')}
                  className="font-semibold text-teal-600 hover:text-teal-700 focus:outline-none"
                >
                  View log →
                </button>
              </div>
            }
          />

          {/* Card 2: Leave Balance */}
          <StatusCard
            title="Leave Balance"
            subtitle="Annual Allowance"
            icon={CalendarDays}
            iconBgColor="bg-amber-50"
            iconTextColor="text-amber-600"
            value={
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900">{remaining}</span>
                <span className="text-xs font-semibold text-slate-500">days remaining</span>
              </div>
            }
            footer={
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span>Used {used} / {total} days</span>
                  <span className="font-bold text-amber-600">{100 - leavePercentage}% available</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${leavePercentage}%` }}
                  />
                </div>
              </div>
            }
          />

          {/* Card 3: Pending Leave Requests */}
          <StatusCard
            title="Pending Requests"
            subtitle="Approval Status"
            icon={FileCheck}
            iconBgColor="bg-indigo-50"
            iconTextColor="text-indigo-600"
            value={
              employeeData.pendingLeaveRequests > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {employeeData.pendingLeaveRequests}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">pending review</span>
                </div>
              ) : (
                <span className="text-base font-bold text-slate-700">No pending requests</span>
              )
            }
            action={
              <button
                onClick={() => navigate('/employee/leave')}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                View requests
              </button>
            }
            footer={
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  {employeeData.pendingLeaveRequests > 0 ? 'Submitted Aug 20' : "You're all caught up."}
                </span>
                <button
                  onClick={() => navigate('/employee/leave')}
                  className="font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none"
                >
                  Apply Leave +
                </button>
              </div>
            }
          />

          {/* Card 4: Latest Payslip */}
          <StatusCard
            title="Latest Payslip"
            subtitle="Salary Statement"
            icon={WalletCards}
            iconBgColor="bg-emerald-50"
            iconTextColor="text-emerald-600"
            value={
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900">
                  {employeeData.latestPayslip.month} {employeeData.latestPayslip.year}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  {employeeData.latestPayslip.available ? 'Ready to download' : 'Processing'}
                </span>
              </div>
            }
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/employee/payroll')}
                className="!text-xs font-bold border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
              >
                View
              </Button>
            }
            footer={
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Direct Deposit</span>
                <span className="font-semibold text-slate-600">Confidential</span>
              </div>
            }
          />
        </div>
      </section>

      {/* Module Grid Section */}
      <section aria-label="Employee Workspace Modules" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your workspace</h2>
            <p className="text-xs text-slate-500">Everything you need for your workday self-service.</p>
          </div>
        </div>

        {/* 3 Columns Desktop, 2 Columns Tablet, 1 Column Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {employeeModulesConfig.map((module) => {
            const badgeValue =
              module.id === 'notifications'
                ? employeeData.notifications.unread
                : module.id === 'leave'
                ? employeeData.pendingLeaveRequests
                : undefined;

            return (
              <ModuleCard
                key={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                route={module.route}
                badge={badgeValue && badgeValue > 0 ? `${badgeValue} ${module.id === 'leave' ? 'pending' : 'new'}` : undefined}
                badgeColor={
                  module.id === 'notifications'
                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
