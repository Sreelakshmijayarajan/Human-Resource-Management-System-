import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, History, CheckCircle2, XCircle } from 'lucide-react';
import { useHRData } from '../../../context/HRDataContext';
import { StatCard } from '../../../components/ui/StatCard';
import { AttendanceCalendar } from './AttendanceCalendar';

export const EmployeeAttendanceDetailPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { employees, attendanceRecords } = useHRData();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const employee = employees.find(e => e.id === employeeId);
  const employeeRecords = useMemo(() => attendanceRecords.filter(r => r.employeeId === employeeId), [attendanceRecords, employeeId]);

  const monthRecords = useMemo(() => {
    return employeeRecords.filter(r => {
      const date = new Date(r.date);
      return date.getFullYear() === currentMonth.getFullYear() && date.getMonth() === currentMonth.getMonth();
    });
  }, [employeeRecords, currentMonth]);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Employee Not Found</h2>
        <p className="text-slate-500 mb-6">The employee record you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/hr/attendance')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium">
          Back to Attendance
        </button>
      </div>
    );
  }

  const presentCount = monthRecords.filter(r => r.status === 'present').length;
  const absentCount = monthRecords.filter(r => r.status === 'absent').length;
  const lateCount = monthRecords.filter(r => r.status === 'late').length;

  const correctionHistory = employeeRecords
    .flatMap(r => r.correctionHistory.map(c => ({ ...c, recordDate: r.date })))
    .sort((a, b) => new Date(b.correctedAt).getTime() - new Date(a.correctedAt).getTime());

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/hr/attendance')}
          className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 hover:shadow-sm transition-all text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center text-sm font-medium text-slate-500 mb-1 gap-2">
            <Link to="/hr/attendance" className="hover:text-indigo-600 transition-colors">Attendance</Link>
            <span>/</span>
            <span className="text-slate-900">{employee.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Attendance Record</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & History */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${employee.avatarColor} text-white text-xl font-bold flex items-center justify-center shadow-sm`}>
              {employee.avatarInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{employee.name}</h2>
              <p className="text-sm font-medium text-slate-500">{employee.id} &middot; {employee.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Present" value={presentCount} icon={CheckCircle2} colorClass="text-emerald-600" />
            <StatCard label="Absent" value={absentCount} icon={XCircle} colorClass="text-red-600" />
            <StatCard label="Late Arrivals" value={lateCount} icon={Clock} colorClass="text-amber-600" className="col-span-2" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-slate-900 text-sm">Correction History</h3>
            </div>
            <div className="p-0">
              {correctionHistory.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No attendance corrections found for this employee.
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {correctionHistory.map(entry => (
                    <div key={entry.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(entry.recordDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <span className="text-xs text-slate-400">{new Date(entry.correctedAt).toLocaleDateString('en-GB')}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Changed from <span className="font-medium line-through">{entry.oldStatus}</span> to <span className="font-medium text-indigo-600">{entry.newStatus}</span></p>
                      <div className="bg-slate-100 rounded-lg p-2.5 text-xs text-slate-600 italic">
                        "{entry.reason}"
                      </div>
                      <p className="text-xs text-slate-400 mt-2 text-right">by {entry.correctedBy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div className="lg:col-span-2">
          <AttendanceCalendar 
            records={employeeRecords} 
            month={currentMonth} 
            onMonthChange={setCurrentMonth} 
          />
        </div>
      </div>
    </div>
  );
};
