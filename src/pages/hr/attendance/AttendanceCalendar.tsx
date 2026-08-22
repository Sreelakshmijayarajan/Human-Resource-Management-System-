import React from 'react';
import { AttendanceRecord } from '../../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../components/ui/StatusBadge';

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  month: Date;
  onMonthChange: (date: Date) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ records, month, onMonthChange }) => {
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const firstDay = getFirstDayOfMonth(year, monthIndex);

  const prevMonth = () => onMonthChange(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => onMonthChange(new Date(year, monthIndex + 1, 1));

  // Create an array for all days in the calendar grid (including empty padding cells)
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDay + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      // Find record for this day
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      const record = records.find(r => r.date === dateStr);
      return { dayNumber, record, dateStr, isCurrentMonth: true };
    }
    return { dayNumber: null, record: null, dateStr: '', isCurrentMonth: false };
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'half_day': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'late': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'on_leave': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'holiday': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-white text-slate-400 border-slate-100'; // No record / future date
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'present': return 'P';
      case 'absent': return 'A';
      case 'half_day': return 'HD';
      case 'late': return 'L';
      case 'on_leave': return 'OL';
      case 'holiday': return 'H';
      default: return '-';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((cell, idx) => (
          <div 
            key={idx} 
            className={cn(
              "aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all",
              cell.isCurrentMonth ? getStatusColor(cell.record?.status) : "opacity-0 invisible"
            )}
            title={cell.record ? `${cell.record.status} (${cell.record.checkIn || ''} - ${cell.record.checkOut || ''})` : ''}
          >
            <span className="text-sm font-semibold opacity-80">{cell.dayNumber}</span>
            {cell.record && (
              <span className="text-xs font-bold mt-1">
                {getStatusLabel(cell.record.status)}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-slate-500 justify-center">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Present (P)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div> Absent (A)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Late (L)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-400"></div> Half Day (HD)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-400"></div> On Leave (OL)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Holiday (H)</div>
      </div>
    </div>
  );
};
