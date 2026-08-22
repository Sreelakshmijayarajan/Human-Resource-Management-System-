import React from 'react';
import { Users, Clock, CalendarDays, WalletCards } from 'lucide-react';

export const HRDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          HR Management Console
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Operational control panel for company-wide headcount, attendance, leaves, and payroll.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400">Total Workforce</p>
          <p className="text-2xl font-extrabold text-slate-900">256 Active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400">Present Today</p>
          <p className="text-2xl font-extrabold text-slate-900">241 (94.1%)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400">Pending Approvals</p>
          <p className="text-2xl font-extrabold text-amber-600">8 Requests</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <WalletCards className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-400">August Payroll</p>
          <p className="text-2xl font-extrabold text-slate-900">Processed</p>
        </div>
      </div>
    </div>
  );
};
