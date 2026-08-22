import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building, Briefcase, Calendar, Shield, Download } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { employeeData } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-xs text-slate-500">Manage your personal details and employment documents.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white text-2xl font-extrabold flex items-center justify-center shadow-md">
            {employeeData.avatarInitials}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{employeeData.name}</h2>
            <p className="text-sm font-semibold text-teal-600">{employeeData.role}</p>
            <p className="text-xs text-slate-400 mt-0.5">{employeeData.department} • Employee ID: {employeeData.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Information</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">{employeeData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Dayflow HQ • San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Employment Details</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-700">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Full-Time Permanent</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Joined January 15, 2024</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Verified Odoo Employee Record</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Need to update official details? Contact HR Administration.</span>
          <button className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Download ID Card
          </button>
        </div>
      </div>
    </div>
  );
};
