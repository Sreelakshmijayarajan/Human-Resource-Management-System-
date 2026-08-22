import React from 'react';
import { Link } from 'react-router-dom';

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  badge?: number | string;
  badgeColor?: string;
  iconBg?: string;
  iconColor?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  route,
  badge,
  iconBg = 'bg-indigo-50/80',
  iconColor = 'text-indigo-600',
}) => {
  return (
    <Link
      to={route}
      className="group relative bg-white dark:bg-[#121821] rounded-2xl p-6 border border-slate-100/90 dark:border-white/[0.07] shadow-sm hover:shadow-md dark:hover:shadow-none hover:border-slate-200/80 dark:hover:border-[#0c8fe9]/25 dark:hover:bg-[#161E28] active:scale-[0.98] transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c8fe9] focus-visible:ring-offset-2"
    >
      <div className="space-y-4">
        {/* Top row: Icon on left, badge on right */}
        <div className="flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-2xl ${iconBg} dark:bg-opacity-[0.12] ${iconColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-2xs`}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Badge counter if present */}
          {badge !== undefined && (
            <span
              className={
                typeof badge === 'number' || (typeof badge === 'string' && badge.length <= 2)
                  ? 'w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs'
                  : 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20'
              }
            >
              {badge}
            </span>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#E5E7EB] group-hover:text-[#0070c7] dark:group-hover:text-[#36abf8] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-400 dark:text-[#707A87] font-normal leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};
