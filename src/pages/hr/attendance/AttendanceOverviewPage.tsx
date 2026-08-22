import React, { useState, useMemo } from 'react';
import { Download, Search, CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useHRData } from '../../../context/HRDataContext';
import { StatCard } from '../../../components/ui/StatCard';
import { AttendanceTable } from './AttendanceTable';
import { CorrectionModal } from './CorrectionModal';
import { exportAttendanceToCSV } from './CsvExport';
import { useToast } from '../../../context/ToastContext';
import { AttendanceRecord } from '../../../types';

export const AttendanceOverviewPage: React.FC = () => {
  const { attendanceRecords, employees, correctAttendance } = useHRData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  
  // Date filter (simple month/year for now)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [correctionRecord, setCorrectionRecord] = useState<AttendanceRecord | null>(null);

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(r => {
      const matchSearch =
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === 'All' || r.department === filterDept;
      
      // Filter by selected month
      const recordDate = new Date(r.date);
      const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
      const matchMonth = recordMonth === selectedMonth;

      return matchSearch && matchDept && matchMonth;
    });
  }, [attendanceRecords, search, filterDept, selectedMonth]);

  // Daily stats based on the MOST RECENT day in the filtered records (or today)
  const latestDate = filteredRecords.length > 0 ? filteredRecords[0].date : new Date().toISOString().split('T')[0];
  const todaysRecords = filteredRecords.filter(r => r.date === latestDate);
  
  const presentToday = todaysRecords.filter(r => r.status === 'present' || r.status === 'half_day' || r.status === 'late').length;
  const absentToday = todaysRecords.filter(r => r.status === 'absent').length;
  const onLeaveToday = todaysRecords.filter(r => r.status === 'on_leave').length;
  
  // Avg Attendance % for the filtered month
  const workingDays = filteredRecords.filter(r => r.status !== 'holiday' && r.status !== 'on_leave');
  const totalPresent = workingDays.filter(r => r.status === 'present' || r.status === 'half_day' || r.status === 'late').length;
  const avgAttendance = workingDays.length > 0 ? Math.round((totalPresent / workingDays.length) * 100) : 0;

  const handleExport = () => {
    showToast('Preparing CSV export...', 'info');
    setTimeout(() => {
      exportAttendanceToCSV(filteredRecords, `attendance_${selectedMonth}.csv`);
      showToast('Export downloaded successfully', 'success');
    }, 500);
  };

  const handleCorrect = (recordId: string, correction: any) => {
    correctAttendance(recordId, correction, 'Admin (Sanjay Kumar)');
    showToast('Attendance record corrected', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Attendance Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track attendance, correct anomalies, and export data</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={`Present (${latestDate})`} value={presentToday} icon={CheckCircle2} colorClass="text-emerald-600" />
        <StatCard label={`Absent (${latestDate})`} value={absentToday} icon={XCircle} colorClass="text-red-600" />
        <StatCard label={`On Leave (${latestDate})`} value={onLeaveToday} icon={CalendarIcon} colorClass="text-amber-600" />
        <StatCard label="Avg Attendance %" value={`${avgAttendance}%`} icon={Clock} colorClass="text-blue-600" />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white text-slate-700 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white text-slate-700 cursor-pointer max-w-[150px] truncate"
            >
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-600">No attendance records found</p>
            <p className="text-sm mt-1">Try selecting a different month or clearing filters.</p>
          </div>
        ) : (
          <AttendanceTable records={filteredRecords} onCorrect={setCorrectionRecord} />
        )}
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500 font-medium bg-slate-50/50">
          Showing {filteredRecords.length} records for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <CorrectionModal
        isOpen={!!correctionRecord}
        onClose={() => setCorrectionRecord(null)}
        record={correctionRecord}
        onSave={handleCorrect}
      />
    </div>
  );
};
