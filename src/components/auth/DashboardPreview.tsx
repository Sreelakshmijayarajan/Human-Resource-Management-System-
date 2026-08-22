import React from 'react';
import { ArrowLeft, CheckCircle2, Users, Calendar, Clock, DollarSign, LogOut } from 'lucide-react';
import { UserRole } from '../../types/auth';

export interface DashboardPreviewProps {
  role: UserRole;
  userEmail: string;
  onReturnToLogin: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  role,
  userEmail,
  onReturnToLogin,
}) => {
  const isHR = role === 'hr_admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12 animate-fade-in flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-white p-4 md:px-8 rounded-2xl shadow-card border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              D
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 leading-tight">Dayflow</div>
              <div className="text-xs text-slate-500 font-medium capitalize">
                {isHR ? 'HR & Administration Workspace' : 'Employee Self-Service Portal'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-slate-900">{userEmail || 'alex.turner@dayflow.io'}</div>
              <div className="text-[11px] text-blue-600 font-medium">
                {isHR ? 'HR Director' : 'Senior Product Designer'}
              </div>
            </div>
            <button
              onClick={onReturnToLogin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authentication Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isHR ? 'Welcome to HR Central' : 'Welcome back to your workspace!'}
            </h2>
            <p className="text-blue-100 text-sm max-w-xl">
              {isHR
                ? 'You have complete operational control over employees, leaves, attendance, and payroll.'
                : 'Track your daily attendance, leave balances, performance reviews, and company announcements.'}
            </p>
          </div>

          <div className="shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs font-mono">
              Redirect Route: <span className="text-amber-300 font-bold">{isHR ? '/hr/dashboard' : '/employee/dashboard'}</span>
            </div>
          </div>
        </div>

        {/* Quick Mock Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {isHR ? 'Total Headcount' : 'Team Members'}
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {isHR ? '256 Active' : '14 Members'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {isHR ? 'Present Rate' : 'Today Check-in'}
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {isHR ? '94.2%' : '09:12 AM'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {isHR ? 'Pending Leave Requests' : 'Available Leaves'}
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {isHR ? '8 Requests' : '16 Days'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {isHR ? 'Payroll Status' : 'Next Pay Date'}
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {isHR ? 'Processed' : 'Feb 28'}
            </div>
          </div>
        </div>

        {/* Action button to return */}
        <div className="text-center pt-4">
          <button
            onClick={onReturnToLogin}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login Screen</span>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 mt-12">
        © 2026 Dayflow HRMS. All rights reserved.
      </div>
    </div>
  );
};
