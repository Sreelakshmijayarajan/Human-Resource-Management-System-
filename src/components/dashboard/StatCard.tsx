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
      <div className={`bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm flex items-center gap-4 animate-pulse ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-slate-100 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-slate-100/90 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0 shadow-2xs`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 tracking-tight">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
};
