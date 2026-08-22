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
  bg: string;
}

interface StatItem {
  title: string;
  count: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const hrModules: HRModule[] = [
  {
    title: 'Employee Management',
    description: 'Profiles, documents, job records',
    icon: Users,
    route: '/hr/employees',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    title: 'Attendance Management',
    description: 'Track, correct & export records',
    icon: Calendar,
    route: '/hr/attendance',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Leave Management',
    description: 'Approve, reject & set policy',
    icon: FileText,
    route: '/hr/leave',
    badge: 3,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    title: 'Payroll Management',
    description: 'Salary structures & payslips',
    icon: DollarSign,
    route: '/hr/payroll',
    badge: 1,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    title: 'Reports & Analytics',
    description: 'Trends & exportable reports',
    icon: BarChart2,
    route: '/hr/reports',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Notifications',
    description: 'Alerts & announcements',
    icon: Bell,
    route: '/hr/notifications',
    badge: 5,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    title: 'Role & Access Control',
    description: 'Manage roles & permissions',
    icon: Shield,
    route: '/hr/roles',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    title: 'Settings',
    description: 'Departments, leave policies',
    icon: Settings,
    route: '/hr/settings',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
];

// ─── StatCard ─────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ stat: StatItem; loading: boolean }> = ({ stat, loading }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
      <div className={`${stat.bg} ${stat.color} p-3 rounded-xl shrink-0`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
        {loading ? (
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 leading-tight">{stat.count}</p>
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
      className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 block"
    >
      {/* Badge */}
      {module.badge != null && module.badge > 0 && (
        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {module.badge}
        </span>
      )}

      <div className={`${module.bg} ${module.color} p-3 rounded-xl inline-flex mb-4`}>
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
        {module.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{module.description}</p>
    </Link>
  );
};

// ─── HRDashboard ──────────────────────────────────────────────────────────────

export const HRDashboard: React.FC = () => {
  const { email } = useAuth();
  const userName = email ? email.split('@')[0] : 'Admin';
  const [loading, setLoading] = useState(true);

  const stats: StatItem[] = [
    { title: 'Total Employees', count: '248', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Present Today', count: '201', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Pending Leaves', count: '3', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Payroll Due', count: '$84,200', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
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
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="capitalize text-indigo-600">{userName}</span> 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening in your organization today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} loading={loading} />
        ))}
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-4">HR Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hrModules.map((mod) => (
            <ModuleCard key={mod.route} module={mod} />
          ))}
        </div>
      </div>
    </div>
  );
};
