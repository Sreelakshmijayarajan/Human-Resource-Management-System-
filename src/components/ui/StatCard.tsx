import React from 'react';
import { cn } from './StatusBadge';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.FC<any>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  colorClass = 'text-indigo-600',
  className
}) => {
  return (
    <div className={cn("bg-white dark:bg-[#121821] rounded-2xl border border-slate-100 dark:border-white/[0.07] shadow-sm p-5 hover:border-[#0c8fe9]/30 transition-all duration-200", className)}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-[#707A87]">{label}</p>
        {Icon && (
          <div className={cn("p-2 rounded-xl bg-opacity-10 dark:bg-opacity-20", colorClass.replace('text-', 'bg-'))}>
            <Icon className={cn("w-4 h-4", colorClass)} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight">{value}</h3>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-lg mb-1",
            trend.isPositive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
};
