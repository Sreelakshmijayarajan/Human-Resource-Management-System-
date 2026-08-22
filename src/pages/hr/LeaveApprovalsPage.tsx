import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, CalendarDays, MessageSquare } from 'lucide-react';

interface LeaveRequest {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  department: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  appliedOn: string;
  status: 'pending' | 'approved' | 'rejected';
}

const initialRequests: LeaveRequest[] = [
  { id: '1', name: 'Rahul Verma', initials: 'RV', avatarColor: 'bg-emerald-500', department: 'Human Resources', leaveType: 'Sick Leave', from: 'Aug 22', to: 'Aug 24', days: 3, reason: 'Fever and medical rest advised by doctor.', appliedOn: 'Aug 21', status: 'pending' },
  { id: '2', name: 'Priya Sharma', initials: 'PS', avatarColor: 'bg-purple-500', department: 'Engineering', leaveType: 'Casual Leave', from: 'Aug 25', to: 'Aug 26', days: 2, reason: 'Family function out of town.', appliedOn: 'Aug 20', status: 'pending' },
  { id: '3', name: 'Dev Patel', initials: 'DP', avatarColor: 'bg-amber-500', department: 'Engineering', leaveType: 'Annual Leave', from: 'Sep 01', to: 'Sep 05', days: 5, reason: 'Planned vacation.', appliedOn: 'Aug 18', status: 'approved' },
  { id: '4', name: 'Ananya Iyer', initials: 'AI', avatarColor: 'bg-pink-500', department: 'Analytics', leaveType: 'Sick Leave', from: 'Aug 15', to: 'Aug 15', days: 1, reason: 'Not feeling well.', appliedOn: 'Aug 14', status: 'approved' },
  { id: '5', name: 'Arjun Singh', initials: 'AS', avatarColor: 'bg-indigo-500', department: 'Engineering', leaveType: 'Casual Leave', from: 'Aug 10', to: 'Aug 10', days: 1, reason: 'Personal work.', appliedOn: 'Aug 09', status: 'rejected' },
];

const statusCfg = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
};

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

export const LeaveApprovalsPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [localReqs, setLocalReqs] = useState(initialRequests);

  const filtered = filter === 'all' ? localReqs : localReqs.filter(r => r.status === filter);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setLocalReqs(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const filterOptions: FilterType[] = ['all', 'pending', 'approved', 'rejected'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leave Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">Review, approve and reject employee leave requests</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: localReqs.filter(r => r.status === 'pending').length, color: 'text-amber-600' },
          { label: 'Approved', value: localReqs.filter(r => r.status === 'approved').length, color: 'text-emerald-600' },
          { label: 'Rejected', value: localReqs.filter(r => r.status === 'rejected').length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={'text-2xl font-extrabold ' + s.color}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {filterOptions.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              'px-4 py-2 text-sm font-semibold rounded-xl transition-colors capitalize ' +
              (filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50')
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={'w-10 h-10 rounded-xl ' + req.avatarColor + ' text-white text-sm font-bold flex items-center justify-center flex-shrink-0'}>
                  {req.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{req.name}</p>
                  <p className="text-xs text-slate-500">{req.department}</p>
                </div>
              </div>
              <span className={'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ' + statusCfg[req.status].className}>
                {statusCfg[req.status].label}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <span>{req.from} – {req.to}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{req.days} day{req.days > 1 ? 's' : ''}</span>
              </div>
              <div className="col-span-2 flex items-start gap-1.5 text-slate-600">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{req.reason}</span>
              </div>
            </div>

            {req.status === 'pending' && (
              <div className="mt-4 flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleAction(req.id, 'approved')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleAction(req.id, 'rejected')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors border border-red-200"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No leave requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};
