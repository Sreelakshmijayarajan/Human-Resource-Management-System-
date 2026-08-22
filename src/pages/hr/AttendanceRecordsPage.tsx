import React, { useState } from 'react';
import { Download, Search, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
}

const records: AttendanceRecord[] = [
  { id: 'E001', name: 'Sanjay Kumar', initials: 'SK', avatarColor: 'bg-blue-500', department: 'Product & Design', date: 'Aug 22, 2026', checkIn: '09:02 AM', checkOut: '06:15 PM', hours: '9h 13m', status: 'present' },
  { id: 'E002', name: 'Priya Sharma', initials: 'PS', avatarColor: 'bg-purple-500', department: 'Engineering', date: 'Aug 22, 2026', checkIn: '09:45 AM', checkOut: '06:30 PM', hours: '8h 45m', status: 'late' },
  { id: 'E003', name: 'Rahul Verma', initials: 'RV', avatarColor: 'bg-emerald-500', department: 'Human Resources', date: 'Aug 22, 2026', checkIn: '—', checkOut: '—', hours: '—', status: 'absent' },
  { id: 'E004', name: 'Ananya Iyer', initials: 'AI', avatarColor: 'bg-pink-500', department: 'Analytics', date: 'Aug 22, 2026', checkIn: '08:55 AM', checkOut: '01:00 PM', hours: '4h 05m', status: 'half_day' },
  { id: 'E005', name: 'Dev Patel', initials: 'DP', avatarColor: 'bg-amber-500', department: 'Engineering', date: 'Aug 22, 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'present' },
  { id: 'E006', name: 'Meera Nair', initials: 'MN', avatarColor: 'bg-cyan-500', department: 'Product & Design', date: 'Aug 22, 2026', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: '9h 10m', status: 'present' },
  { id: 'E007', name: 'Arjun Singh', initials: 'AS', avatarColor: 'bg-indigo-500', department: 'Engineering', date: 'Aug 22, 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'present' },
  { id: 'E008', name: 'Kavitha Reddy', initials: 'KR', avatarColor: 'bg-rose-500', department: 'Finance', date: 'Aug 22, 2026', checkIn: '10:15 AM', checkOut: '06:00 PM', hours: '7h 45m', status: 'late' },
];

const statusConfig = {
  present: { label: 'Present', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  absent: { label: 'Absent', icon: XCircle, className: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  late: { label: 'Late', icon: Clock, className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  half_day: { label: 'Half Day', icon: Calendar, className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
};

const stats = [
  { label: 'Total', color: 'text-slate-900' },
  { label: 'Present', color: 'text-emerald-600' },
  { label: 'Late', color: 'text-amber-600' },
  { label: 'Absent', color: 'text-red-600' },
];

export const AttendanceRecordsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = records.filter(
    r => r.name.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase())
  );
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const statValues = [records.length, present, late, absent];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Attendance Records</h1>
          <p className="text-sm text-slate-500 mt-1">Track, correct and export attendance data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={'text-2xl font-extrabold ' + s.color}>{statValues[i]}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Date</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Check In</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Check Out</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Hours</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(rec => {
              const cfg = statusConfig[rec.status];
              const Icon = cfg.icon;
              return (
                <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={'w-9 h-9 rounded-xl ' + rec.avatarColor + ' text-white text-xs font-bold flex items-center justify-center'}>
                        {rec.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{rec.name}</p>
                        <p className="text-xs text-slate-500">{rec.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-slate-600 text-xs">{rec.date}</td>
                  <td className="px-5 py-4 hidden sm:table-cell text-slate-700 font-medium">{rec.checkIn}</td>
                  <td className="px-5 py-4 hidden sm:table-cell text-slate-700 font-medium">{rec.checkOut}</td>
                  <td className="px-5 py-4 hidden lg:table-cell text-slate-600 text-xs">{rec.hours}</td>
                  <td className="px-5 py-4">
                    <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ' + cfg.className}>
                      <Icon className="w-3 h-3" />{cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
