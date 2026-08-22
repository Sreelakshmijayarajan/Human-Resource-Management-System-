import React from 'react';
import { LeaveStatus, LeaveType } from '../../types/leave';

interface StatusBadgeProps {
  status?: LeaveStatus | 'paid' | 'pending';
  leaveType?: LeaveType;
  customLabel?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  leaveType,
  customLabel,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-2.5 py-1 text-xs font-semibold';

  if (leaveType) {
    const leaveConfig: Record<LeaveType, { label: string; style: string }> = {
      sick: { label: 'Sick Leave', style: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60' },
      casual: { label: 'Casual Leave', style: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200/60' },
      earned: { label: 'Earned Leave', style: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200/60' },
      unpaid: { label: 'Unpaid Leave', style: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/60' },
      maternity_paternity: { label: 'Maternity/Paternity', style: 'bg-pink-50 text-pink-700 ring-1 ring-pink-200/60' },
    };

    const cfg = leaveConfig[leaveType] || { label: leaveType, style: 'bg-slate-100 text-slate-700' };

    return (
      <span className={`inline-flex items-center rounded-full tracking-wide ${sizeClasses} ${cfg.style}`}>
        {customLabel || cfg.label}
      </span>
    );
  }

  if (status) {
    const statusConfig: Record<string, { label: string; style: string; dot: string }> = {
      pending: { label: 'Pending', style: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80', dot: 'bg-amber-500' },
      approved: { label: 'Approved', style: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80', dot: 'bg-emerald-500' },
      rejected: { label: 'Rejected', style: 'bg-red-50 text-red-700 ring-1 ring-red-200/80', dot: 'bg-red-500' },
      paid: { label: 'Paid', style: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80', dot: 'bg-emerald-500' },
    };

    const cfg = statusConfig[status] || { label: status, style: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' };

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full tracking-wide ${sizeClasses} ${cfg.style}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {customLabel || cfg.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
      {customLabel || 'N/A'}
    </span>
  );
};
