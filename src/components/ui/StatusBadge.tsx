import React from 'react';
import { CheckCircle2, XCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export type BadgeStatus = 'active' | 'inactive' | 'on_leave' | 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'pending' | 'approved' | 'rejected' | 'paid';

interface StatusBadgeProps {
  status?: BadgeStatus | string;
  leaveType?: string;
  customLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<string, { label: string; icon?: React.FC<any>; classes: string; dot?: string }> = {
  active: { label: 'Active', icon: CheckCircle2, classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20' },
  inactive: { label: 'Inactive', icon: XCircle, classes: 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-[#707A87] ring-1 ring-slate-200 dark:ring-white/[0.08]' },
  on_leave: { label: 'On Leave', icon: Calendar, classes: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-500/20' },
  present: { label: 'Present', icon: CheckCircle2, classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20' },
  absent: { label: 'Absent', icon: XCircle, classes: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/20' },
  late: { label: 'Late', icon: Clock, classes: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-500/20' },
  half_day: { label: 'Half Day', icon: AlertCircle, classes: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-500/20' },
  holiday: { label: 'Holiday', icon: Calendar, classes: 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-[#A7B0BC] ring-1 ring-slate-200 dark:ring-white/[0.08]' },
  pending: { label: 'Pending', icon: Clock, classes: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200/80 dark:ring-amber-500/20', dot: 'bg-amber-500' },
  approved: { label: 'Approved', icon: CheckCircle2, classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200/80 dark:ring-emerald-500/20', dot: 'bg-emerald-500' },
  rejected: { label: 'Rejected', icon: XCircle, classes: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-red-200/80 dark:ring-red-500/20', dot: 'bg-red-500' },
  paid: { label: 'Paid', icon: CheckCircle2, classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200/80 dark:ring-emerald-500/20', dot: 'bg-emerald-500' },
};

const leaveConfig: Record<string, { label: string; style: string }> = {
  sick: { label: 'Sick Leave', style: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200/60 dark:ring-blue-500/20' },
  casual: { label: 'Casual Leave', style: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-1 ring-purple-200/60 dark:ring-purple-500/20' },
  earned: { label: 'Earned Leave', style: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 ring-1 ring-teal-200/60 dark:ring-teal-500/20' },
  unpaid: { label: 'Unpaid Leave', style: 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-[#A7B0BC] ring-1 ring-slate-200/60 dark:ring-white/[0.08]' },
  maternity_paternity: { label: 'Maternity/Paternity', style: 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 ring-1 ring-pink-200/60 dark:ring-pink-500/20' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  leaveType,
  customLabel,
  size = 'md',
  className,
  showIcon = true,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-2.5 py-1 text-xs font-semibold';

  if (leaveType) {
    const cfg = leaveConfig[leaveType] || { label: leaveType, style: 'bg-slate-100 text-slate-700' };
    return (
      <span className={cn('inline-flex items-center rounded-full tracking-wide', sizeClasses, cfg.style, className)}>
        {customLabel || cfg.label}
      </span>
    );
  }

  if (status) {
    const config = statusConfig[status];
    if (config) {
      const Icon = config.icon;
      return (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full tracking-wide', sizeClasses, config.classes, className)}>
          {showIcon && Icon && <Icon className="w-3.5 h-3.5" />}
          {customLabel || config.label}
        </span>
      );
    }
  }

  return (
    <span className={cn('inline-flex items-center rounded-full bg-slate-100 text-slate-700', sizeClasses, className)}>
      {customLabel || status || 'N/A'}
    </span>
  );
};
