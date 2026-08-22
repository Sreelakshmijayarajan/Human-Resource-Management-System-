import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, Save } from 'lucide-react';

export const HRSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <Link
          to="/hr/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to HR Dashboard</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Settings & Policy Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure corporate departments, standard working hours, and annual leave allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Config */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Departments & Units</h3>
              <p className="text-xs text-slate-400">Manage business departments</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">Engineering & Tech</span>
              <span className="text-slate-400">112 Members</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">Product & Design</span>
              <span className="text-slate-400">42 Members</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">Human Resources</span>
              <span className="text-slate-400">14 Members</span>
            </div>
          </div>
        </div>

        {/* Leave Policy Config */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leave Policies</h3>
              <p className="text-xs text-slate-400">Annual statutory allocations</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2">
              <span className="text-slate-700 font-medium">Paid Leaves (Annual)</span>
              <span className="font-bold text-slate-900">18 Days</span>
            </div>
            <div className="flex items-center justify-between p-2">
              <span className="text-slate-700 font-medium">Sick / Medical Leaves</span>
              <span className="font-bold text-slate-900">12 Days</span>
            </div>
            <div className="flex items-center justify-between p-2">
              <span className="text-slate-700 font-medium">Casual / Personal Leaves</span>
              <span className="font-bold text-slate-900">6 Days</span>
            </div>
          </div>

          <button className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors">
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
