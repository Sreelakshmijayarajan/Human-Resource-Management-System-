import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  List, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Timer,
  LayoutGrid
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { CheckInOutCard } from '../../components/employee/CheckInOutCard';
import { AttendanceCalendarView } from '../../components/employee/AttendanceCalendarView';
import { AttendanceListView } from '../../components/employee/AttendanceListView';
import { StatCard } from '../../components/ui/StatCard';
import { DashboardSkeleton } from '../../components/ui/Skeletons';

export const AttendancePage: React.FC = () => {
  const { attendanceHistory } = useAppContext();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Compute month summary stats
  const presentCount = attendanceHistory.filter(
    (r) => r.status === 'present' || r.status === 'late' || r.status === 'half_day'
  ).length;

  const absentCount = attendanceHistory.filter((r) => r.status === 'absent').length;
  const lateCount = attendanceHistory.filter((r) => r.status === 'late').length;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 shadow-sm transition-all"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">My Attendance</h1>
            <p className="text-xs text-slate-500">Track daily check-ins, check-outs, and monthly work logs.</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Calendar View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
        </div>
      </div>

      {/* Prominent Check In / Check Out Card (Shared with Dashboard) */}
      <section aria-label="Check In Out Action">
        <CheckInOutCard />
      </section>

      {/* Summary Stats (4 Cards) */}
      <section aria-label="Monthly Attendance Stats">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Present Days"
            value={presentCount}
            icon={CheckCircle2}
            colorClass="text-emerald-600"
          />
          <StatCard
            label="Absent Days"
            value={absentCount}
            icon={XCircle}
            colorClass="text-red-600"
          />
          <StatCard
            label="Late Arrivals"
            value={lateCount}
            icon={Clock}
            colorClass="text-amber-600"
          />
          <StatCard
            label="Total Work Hours"
            value="176.5h"
            icon={Timer}
            colorClass="text-teal-600"
          />
        </div>
      </section>

      {/* Main Attendance View (Calendar or List) */}
      <section aria-label="Attendance Log View">
        {viewMode === 'calendar' ? (
          <AttendanceCalendarView records={attendanceHistory} />
        ) : (
          <AttendanceListView records={attendanceHistory} />
        )}
      </section>
    </div>
  );
};
