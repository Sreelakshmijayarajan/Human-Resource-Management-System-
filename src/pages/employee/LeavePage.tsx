import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const LeavePage: React.FC = () => {
  const { employeeData } = useAppContext();
  const navigate = useNavigate();

  const mockRequests = [
    { type: 'Annual Leave', dates: 'Aug 25, 2026 - Aug 26, 2026', days: 2, status: 'Approved', reason: 'Personal errands' },
    { type: 'Sick Leave', dates: 'Jul 10, 2026', days: 1, status: 'Approved', reason: 'Medical appointment' },
    { type: 'Casual Leave', dates: 'Sep 05, 2026', days: 1, status: 'Pending', reason: 'Family event' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Leave Management</h1>
            <p className="text-xs text-slate-500">Apply for time off and review approval statuses.</p>
          </div>
        </div>

        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase">Remaining Balance</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{employeeData.leaveBalance.remaining} Days</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase">Used Days</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{employeeData.leaveBalance.used} Days</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase">Pending Requests</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-1">{employeeData.pendingLeaveRequests} Pending</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Recent Leave Applications</h3>
        <div className="divide-y divide-slate-100">
          {mockRequests.map((req, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{req.type} ({req.days} day{req.days > 1 ? 's' : ''})</p>
                <p className="text-slate-500 mt-0.5">{req.dates} • Reason: {req.reason}</p>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
