import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserRound, 
  Clock, 
  CalendarDays, 
  WalletCards, 
  Bell, 
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { StatusCard } from '../../components/dashboard/StatusCard';
import { DashboardSkeleton } from '../../components/ui/Skeletons';
import { CheckInOutCard } from '../../components/employee/CheckInOutCard';
import { ActivityFeed } from '../../components/employee/ActivityFeed';

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
    title: 'Leave Management',
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
  const { user, employeeData, activityFeed } = useAppContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const { total, used, remaining } = employeeData.leaveBalance;
  const leavePercentage = Math.round((used / total) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.firstName || employeeData.firstName || 'Sanjay'}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
            <span>{todayFormatted}</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-semibold bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-lg text-xs">
              Here's your personal workday snapshot.
            </span>
          </p>
        </div>
      </div>

      {/* Prominent Check In / Check Out Card (Shared Component) */}
      <section aria-label="Today Shift Check In Out">
        <CheckInOutCard />
      </section>

      {/* Quick Status Row (3 Cards) */}
      <section aria-label="Daily Status Summary" className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Personal Status Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Leave Balance */}
          <StatusCard
            title="Leave Balance"
            subtitle="Annual Allowance"
            icon={CalendarDays}
            iconBgColor="bg-teal-50"
            iconTextColor="text-teal-600"
            value={
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900">{remaining}</span>
                <span className="text-xs font-semibold text-slate-500">days remaining</span>
              </div>
            }
            footer={
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Used {used} / {total} days</span>
                  <span className="font-bold text-teal-700">{100 - leavePercentage}% left</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${leavePercentage}%` }}
                  />
                </div>
              </div>
            }
          />

          {/* Card 2: This Month's Attendance % */}
          <StatusCard
            title="Attendance Rate"
            subtitle="Current Month"
            icon={Clock}
            iconBgColor="bg-emerald-50"
            iconTextColor="text-emerald-600"
            value={
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">96.4%</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  <TrendingUp className="w-3 h-3" /> +2.1%
                </span>
              </div>
            }
            footer={
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">21 of 22 shifts logged</span>
                <button
                  onClick={() => navigate('/employee/attendance')}
                  className="font-bold text-teal-600 hover:text-teal-700 focus:outline-none"
                >
                  View log →
                </button>
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
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {employeeData.pendingLeaveRequests}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                    pending review
                  </span>
                </div>
              ) : (
                <span className="text-base font-bold text-slate-700">No pending requests</span>
              )
            }
            action={
              <button
                onClick={() => navigate('/employee/leave')}
                className="px-3 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                View requests
              </button>
            }
            footer={
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {employeeData.pendingLeaveRequests > 0 ? 'Submitted Aug 20' : "You're all caught up."}
                </span>
                <button
                  onClick={() => navigate('/employee/leave')}
                  className="font-bold text-indigo-600 hover:text-indigo-700 focus:outline-none"
                >
                  Apply Leave +
                </button>
              </div>
            }
          />
        </div>
      </section>

      {/* Two Column Layout: Activity Feed & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity Feed (2 Cols on LG) */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={activityFeed} />
        </div>

        {/* Right Column: Quick Navigation Links */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Module Quick Access
          </h2>

          <div className="space-y-3">
            {employeeModulesConfig.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => navigate(module.route)}
                  className="w-full text-left bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
