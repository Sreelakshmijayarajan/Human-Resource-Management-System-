import React, { useState } from 'react';
import { MyAttendanceRecord } from '../../data/mockMyAttendance';
import { StatusBadge, BadgeStatus } from '../ui/StatusBadge';
import { ArrowUpDown, Calendar, Clock } from 'lucide-react';

interface AttendanceListViewProps {
  records: MyAttendanceRecord[];
}

export const AttendanceListView: React.FC<AttendanceListViewProps> = ({ records }) => {
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default descending (newest first)

  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100 dark:border-white/[0.07] shadow-xs overflow-hidden space-y-0">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 dark:text-[#F5F7FA] text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Timesheet Attendance Log
        </h3>

        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-[#A7B0BC] hover:text-teal-700 dark:hover:text-teal-400 bg-slate-50 dark:bg-[#161E28] hover:bg-teal-50 dark:hover:bg-[#1B2531] border border-slate-200 dark:border-white/[0.08] rounded-xl transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort Date: {sortAsc ? 'Oldest First' : 'Newest First'}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-[#161E28] text-slate-500 dark:text-[#707A87] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.06]">
            <tr>
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-4">Check In</th>
              <th className="py-3.5 px-4">Check Out</th>
              <th className="py-3.5 px-4">Total Duration</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {sortedRecords.map((r) => {
              const formattedDate = new Date(r.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1B2531]/40 transition-colors group">
                  <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#707A87] shrink-0" />
                    <span>{formattedDate}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-[#E5E7EB]">{r.checkIn || '—'}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-[#E5E7EB]">{r.checkOut || '—'}</td>
                  <td className="py-3.5 px-4 font-extrabold text-teal-800 dark:text-teal-400">{r.totalHours || '—'}</td>
                  <td className="py-3.5 px-6 text-right">
                    <StatusBadge status={r.status as BadgeStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#161E28]/40 text-[11px] font-medium text-slate-400 dark:text-[#707A87] flex justify-between items-center">
        <span>Showing {sortedRecords.length} records</span>
        <span>Timesheet sync: Automated Odoo Integration</span>
      </div>
    </div>
  );
};
