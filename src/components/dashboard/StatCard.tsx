import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconTextColor?: string;
  isLoading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-indigo-50',
  iconTextColor = 'text-indigo-600',
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-[#121821] rounded-2xl p-5 border border-slate-100/90 dark:border-white/[0.07] shadow-sm flex items-center gap-4 animate-pulse ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.06] shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-slate-100 dark:bg-white/[0.06] rounded" />
          <div className="h-6 w-16 bg-slate-200 dark:bg-white/[0.09] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-[#121821] rounded-2xl p-5 border border-slate-100/90 dark:border-white/[0.07] shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-white/[0.12] transition-all duration-200 flex items-center gap-4 ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl ${iconBgColor} dark:bg-opacity-[0.12] ${iconTextColor} flex items-center justify-center shrink-0 shadow-2xs`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-[#707A87] tracking-tight">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
};
