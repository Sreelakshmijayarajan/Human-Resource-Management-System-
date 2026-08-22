import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatusCardProps {
  title: string;
  subtitle?: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  subtitle,
  value,
  icon: Icon,
  iconBgColor = 'bg-teal-50',
  iconTextColor = 'text-teal-600',
  action,
  footer,
  className = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#121821] rounded-2xl p-5 border border-slate-100 dark:border-white/[0.07] shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0 shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#707A87]">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 dark:text-[#707A87] font-medium">{subtitle}</p>}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="space-y-1">
        <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] tracking-tight leading-none">
          {value}
        </div>
      </div>

      {footer && <div className="pt-2 border-t border-slate-50 dark:border-white/[0.06] text-xs text-slate-500 dark:text-[#A7B0BC]">{footer}</div>}
    </div>
  );
};
