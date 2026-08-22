import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  BarChart2,
  Bell,
  Shield,
  Settings,
  UserCheck,
  Clock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HRModule {
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  badge?: number;
  color: string;
  darkColor: string;
  bg: string;
  darkBg: string;
}

interface StatItem {
  title: string;
  count: string;
  icon: React.ElementType;
  color: string;
  darkColor: string;
  bg: string;
  darkBg: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const hrModules: HRModule[] = [
  {
    title: 'Employee Management',
    description: 'Profiles, documents, job records',
    icon: Users,
    route: '/hr/employees',
    color: 'text-indigo-600',
    darkColor: 'dark:text-indigo-400',
    bg: 'bg-indigo-50',
    darkBg: 'dark:bg-indigo-500/10',
  },
  {
    title: 'Attendance Management',
    description: 'Track, correct & export records',
    icon: Calendar,
    route: '/hr/attendance',
    color: 'text-blue-600',
    darkColor: 'dark:text-blue-400',
    bg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-500/10',
  },
  {
    title: 'Leave Management',
    description: 'Approve, reject & set policy',
    icon: FileText,
    route: '/hr/leave',
    badge: 3,
    color: 'text-orange-600',
    darkColor: 'dark:text-orange-400',
    bg: 'bg-orange-50',
    darkBg: 'dark:bg-orange-500/10',
  },
  {
    title: 'Payroll Management',
    description: 'Salary structures & payslips',
    icon: DollarSign,
    route: '/hr/payroll',
    badge: 1,
    color: 'text-green-600',
    darkColor: 'dark:text-green-400',
    bg: 'bg-green-50',
    darkBg: 'dark:bg-green-500/10',
  },
  {
    title: 'Reports & Analytics',
    description: 'Trends & exportable reports',
    icon: BarChart2,
    route: '/hr/reports',
    color: 'text-purple-600',
    darkColor: 'dark:text-purple-400',
    bg: 'bg-purple-50',
    darkBg: 'dark:bg-purple-500/10',
  },
  {
    title: 'Notifications',
    description: 'Alerts & announcements',
    icon: Bell,
    route: '/hr/notifications',
    badge: 5,
    color: 'text-red-600',
    darkColor: 'dark:text-red-400',
    bg: 'bg-red-50',
    darkBg: 'dark:bg-red-500/10',
  },
  {
    title: 'Role & Access Control',
    description: 'Manage roles & permissions',
    icon: Shield,
    route: '/hr/roles',
    color: 'text-teal-600',
    darkColor: 'dark:text-teal-400',
    bg: 'bg-teal-50',
    darkBg: 'dark:bg-teal-500/10',
  },
  {
    title: 'Settings',
    description: 'Departments, leave policies',
    icon: Settings,
    route: '/hr/settings',
    color: 'text-slate-600',
    darkColor: 'dark:text-slate-400',
    bg: 'bg-slate-100',
    darkBg: 'dark:bg-slate-500/10',
  },
];

// ─── StatCard ─────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ stat: StatItem; loading: boolean }> = ({ stat, loading }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-white dark:bg-[#121821] rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-white/[0.07]">
      <div className={`${stat.bg} ${stat.darkBg} ${stat.color} ${stat.darkColor} p-3 rounded-xl shrink-0`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-[#707A87] font-medium">{stat.title}</p>
        {loading ? (
          <div className="h-6 w-16 bg-gray-200 dark:bg-white/[0.06] rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-[#F5F7FA] leading-tight">{stat.count}</p>
        )}
      </div>
    </div>
  );
};

// ─── ModuleCard ───────────────────────────────────────────────────────────────

const ModuleCard: React.FC<{ module: HRModule }> = ({ module }) => {
  const Icon = module.icon;
  return (
    <Link
      to={module.route}
      className="group relative bg-white dark:bg-[#121821] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.07] shadow-sm hover:shadow-md dark:hover:shadow-none hover:border-indigo-200 dark:hover:border-[#0c8fe9]/30 dark:hover:bg-[#161E28] active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c8fe9] focus-visible:ring-offset-2 block"
    >
      {/* Badge */}
      {module.badge != null && module.badge > 0 && (
        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {module.badge}
        </span>
      )}

      <div className={`${module.bg} ${module.darkBg} ${module.color} ${module.darkColor} p-3 rounded-xl inline-flex mb-4`}>
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-[#E5E7EB] group-hover:text-indigo-700 dark:group-hover:text-[#36abf8] transition-colors">
        {module.title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-[#707A87] mt-1 leading-relaxed">{module.description}</p>
    </Link>
  );
};

// ─── HRDashboard ──────────────────────────────────────────────────────────────

export const HRDashboard: React.FC = () => {
  const { email } = useAuth();
  const userName = email ? email.split('@')[0] : 'Admin';
  const [loading, setLoading] = useState(true);

  const stats: StatItem[] = [
    {
      title: 'Total Employees',
      count: '248',
      icon: Users,
      color: 'text-indigo-600',
      darkColor: 'dark:text-indigo-400',
      bg: 'bg-indigo-50',
      darkBg: 'dark:bg-indigo-500/10',
    },
    {
      title: 'Present Today',
      count: '201',
      icon: UserCheck,
      color: 'text-green-600',
      darkColor: 'dark:text-green-400',
      bg: 'bg-green-50',
      darkBg: 'dark:bg-green-500/10',
    },
    {
      title: 'Pending Leaves',
      count: '3',
      icon: Clock,
      color: 'text-orange-600',
      darkColor: 'dark:text-orange-400',
      bg: 'bg-orange-50',
      darkBg: 'dark:bg-orange-500/10',
    },
    {
      title: 'Payroll Due',
      count: '$84,200',
      icon: DollarSign,
      color: 'text-blue-600',
      darkColor: 'dark:text-blue-400',
      bg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-500/10',
    },
  ];

  // Simulate data fetch
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F5F7FA]">
          Welcome back, <span className="capitalize text-[#0c8fe9]">{userName}</span> 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#707A87] mt-1">Here's what's happening in your organization today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 dark:text-[#A7B0BC] mb-4">HR Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hrModules.map((mod) => (
            <ModuleCard key={mod.route} module={mod} />
          ))}
        </div>
      </div>
    </div>
  );
};
