import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  badge?: string | number;
  badgeColor?: string;
  iconBgColor?: string;
  iconTextColor?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  route,
  badge,
  badgeColor = 'bg-teal-50 text-teal-700 border-teal-200/60',
  iconBgColor = 'bg-teal-50/80 group-hover:bg-teal-500',
  iconTextColor = 'text-teal-600 group-hover:text-white',
}) => {
  return (
    <Link
      to={route}
      className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div
            className={`w-11 h-11 rounded-2xl ${iconBgColor} ${iconTextColor} flex items-center justify-center transition-colors duration-200 shadow-sm`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            {badge !== undefined && (
              <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${badgeColor}`}>
                {badge}
              </span>
            )}
            <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-teal-50 text-slate-400 group-hover:text-teal-600 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Subtle indicator bar on hover */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-teal-600 transition-colors">
        <span>Open module</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-600 font-bold">→</span>
      </div>
    </Link>
  );
};
