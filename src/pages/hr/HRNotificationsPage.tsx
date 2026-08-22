import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowLeft, Send, CheckCircle2, Megaphone } from 'lucide-react';

export const HRNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/hr/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to HR Dashboard</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Broadcast alerts, company-wide announcements, and policy updates.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors">
          <Send className="w-3.5 h-3.5" />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">3 Pending Leave Approvals Waiting</h3>
              <span className="text-xs text-slate-400">10 mins ago</span>
            </div>
            <p className="text-xs text-slate-500">
              Rahul Verma, Priya Sharma, and Alex Turner submitted new leave requests for August.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Q3 Town Hall Scheduled</h3>
              <span className="text-xs text-slate-400">2 hours ago</span>
            </div>
            <p className="text-xs text-slate-500">
              All-hands meeting scheduled for this Thursday at 3:00 PM IST via Google Meet.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">August Payroll Cycle Ready</h3>
              <span className="text-xs text-slate-400">Yesterday</span>
            </div>
            <p className="text-xs text-slate-500">
              Salary structures computed for 248 active employees. Ready for final disbursement approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
