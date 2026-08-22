import React from 'react';
import { CheckCircle2, XCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeStatus = 'active' | 'inactive' | 'on_leave' | 'present' | 'absent' | 'late' | 'half_day' | 'holiday';

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<BadgeStatus, { label: string; icon: React.FC<any>; classes: string }> = {
  active: { label: 'Active', icon: CheckCircle2, classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  inactive: { label: 'Inactive', icon: XCircle, classes: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
  on_leave: { label: 'On Leave', icon: Calendar, classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  present: { label: 'Present', icon: CheckCircle2, classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  absent: { label: 'Absent', icon: XCircle, classes: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  late: { label: 'Late', icon: Clock, classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  half_day: { label: 'Half Day', icon: AlertCircle, classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  holiday: { label: 'Holiday', icon: Calendar, classes: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
};

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, showIcon = true }) => {
  const config = statusConfig[status];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', config.classes, className)}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
};
