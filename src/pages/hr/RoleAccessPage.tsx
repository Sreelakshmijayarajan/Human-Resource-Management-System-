import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Plus, Check, Lock } from 'lucide-react';

export const RoleAccessPage: React.FC = () => {
  const roles = [
    { name: 'Super Admin', users: 2, access: 'Full system privileges', color: 'bg-rose-50 text-rose-700' },
    { name: 'HR Administrator', users: 5, access: 'Employee, Attendance, Leave & Payroll control', color: 'bg-indigo-50 text-indigo-700' },
    { name: 'Department Manager', users: 18, access: 'Team approvals, attendance verification', color: 'bg-blue-50 text-blue-700' },
    { name: 'Standard Employee', users: 223, access: 'Self-service portal, check-in, leave apply', color: 'bg-slate-100 text-slate-700' },
  ];

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
            Role & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage granular permissions, security policies, and administrative roles.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors">
          <Plus className="w-3.5 h-3.5" />
          <span>Create Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div key={r.name} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${r.color}`}>
                    {r.users} Active Users
                  </span>
                </div>
              </div>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>

            <p className="text-xs text-slate-500">{r.access}</p>

            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Configured
              </span>
              <button className="font-semibold text-indigo-600 hover:underline">Edit Permissions</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
