import React from 'react';
import { Link } from 'react-router-dom';
import { AttendanceRecord } from '../../../types';
import { StatusBadge, BadgeStatus } from '../../../components/ui/StatusBadge';
import { Edit3 } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onCorrect: (record: AttendanceRecord) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onCorrect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Date</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Check In</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Check Out</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Hours</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th className="px-5 py-3.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {records.map(rec => (
            <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors group">
              <td className="px-5 py-4">
                <Link to={`/hr/attendance/${rec.employeeId}`} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${rec.avatarColor} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {rec.employeeInitials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{rec.employeeName}</p>
                    <p className="text-xs text-slate-500 font-medium">{rec.department}</p>
                  </div>
                </Link>
              </td>
              <td className="px-5 py-4 hidden md:table-cell text-slate-600 text-xs font-medium">
                {new Date(rec.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-5 py-4 hidden sm:table-cell text-slate-700 font-semibold">{rec.checkIn || '—'}</td>
              <td className="px-5 py-4 hidden sm:table-cell text-slate-700 font-semibold">{rec.checkOut || '—'}</td>
              <td className="px-5 py-4 hidden lg:table-cell text-slate-600 text-xs font-medium">{rec.totalHours || '—'}</td>
              <td className="px-5 py-4">
                <StatusBadge status={rec.status as BadgeStatus} />
              </td>
              <td className="px-5 py-4 text-right">
                <button 
                  onClick={() => onCorrect(rec)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-xs font-semibold"
                  title="Correct Attendance"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Correct
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
