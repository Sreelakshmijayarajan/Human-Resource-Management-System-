import React from 'react';
import { ActivityItem } from '../../data/mockActivityFeed';
import { Clock, CalendarCheck, WalletCards, Bell, Activity } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'attendance':
        return <Clock className="w-4 h-4 text-teal-600" />;
      case 'leave':
        return <CalendarCheck className="w-4 h-4 text-indigo-600" />;
      case 'payroll':
        return <WalletCards className="w-4 h-4 text-emerald-600" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-amber-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBgColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'attendance':
        return 'bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20';
      case 'leave':
        return 'bg-indigo-50 dark:bg-[#0c8fe9]/10 border-indigo-100 dark:border-[#0c8fe9]/20';
      case 'payroll':
        return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
      case 'announcement':
        return 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
      default:
        return 'bg-slate-50 dark:bg-[#161E28] border-slate-100 dark:border-white/[0.08]';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100 dark:border-white/[0.07] p-8 text-center shadow-xs">
        <Activity className="w-10 h-10 text-slate-300 dark:text-[#707A87] mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-700 dark:text-[#E5E7EB]">No Recent Activity</h3>
        <p className="text-xs text-slate-400 dark:text-[#707A87] mt-1">Updates and logs will appear here as you use the workspace.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100 dark:border-white/[0.07] shadow-xs overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Recent Activity Feed
        </h3>
        <span className="text-xs font-semibold text-slate-400 dark:text-[#707A87]">Last 5 logs</span>
      </div>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 dark:border-white/[0.06] hover:border-slate-200 dark:hover:border-white/[0.12] hover:bg-slate-50/70 dark:hover:bg-[#161E28] transition-all group"
          >
            <div className={`p-2.5 rounded-xl border shrink-0 ${getBgColor(item.type)}`}>
              {getIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {item.title}
                </h4>
                <span className="text-[11px] font-medium text-slate-400 dark:text-[#707A87] shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A7B0BC] mt-0.5 font-medium truncate">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
