import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { ModuleCard } from '../../components/dashboard/ModuleCard';
import { hrModules } from '../../config/hrModules';
import { useAppContext } from '../../context/AppContext';

export const HRDashboard: React.FC = () => {
  const { user } = useAppContext();

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-8">
      {/* Greeting Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.firstName || 'Admin'}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">
          Here's what's happening in your organization today.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Employees"
          value="248"
          icon={Users}
          iconBgColor="bg-indigo-50/90"
          iconTextColor="text-indigo-600"
        />

        <StatCard
          title="Present Today"
          value="201"
          icon={UserCheck}
          iconBgColor="bg-emerald-50/90"
          iconTextColor="text-emerald-600"
        />

        <StatCard
          title="Pending Leaves"
          value="3"
          icon={Clock}
          iconBgColor="bg-orange-50/90"
          iconTextColor="text-orange-600"
        />

        <StatCard
          title="Payroll Due"
          value="$84,200"
          icon={DollarSign}
          iconBgColor="bg-blue-50/90"
          iconTextColor="text-blue-600"
        />
      </div>

      {/* HR Modules Section */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          HR Modules
        </h2>

        {/* 8 Module Cards Grid (4 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {hrModules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              route={module.route}
              badge={module.badge}
              iconBg={module.iconBg}
              iconColor={module.iconColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
