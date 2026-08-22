import React, { useState } from 'react';
import { MyAttendanceRecord } from '../../data/mockMyAttendance';
import { AttendanceDayPopover } from './AttendanceDayPopover';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface AttendanceCalendarViewProps {
  records: MyAttendanceRecord[];
}

export const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({ records }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedRecord, setSelectedRecord] = useState<MyAttendanceRecord | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const todayStr = new Date().toISOString().split('T')[0];
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Color mappings
  const getDayStyle = (status?: string, isWeekend?: boolean) => {
    if (isWeekend || status === 'weekend') {
      return 'bg-slate-100/70 dark:bg-[#161E28]/40 text-slate-400 dark:text-[#707A87] border-slate-200 dark:border-white/[0.04]';
    }
    switch (status) {
      case 'present':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-500/20';
      case 'absent':
        return 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/20 hover:bg-red-100/80 dark:hover:bg-red-500/20';
      case 'half_day':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100/80 dark:hover:bg-amber-500/20';
      case 'late':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 hover:bg-amber-100/80 dark:hover:bg-amber-500/20';
      case 'on_leave':
        return 'bg-blue-50 dark:bg-[#0c8fe9]/10 text-blue-800 dark:text-[#36abf8] border-blue-200 dark:border-[#0c8fe9]/20 hover:bg-blue-100/80 dark:hover:bg-[#0c8fe9]/20';
      case 'holiday':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/20 hover:bg-purple-100/80 dark:hover:bg-purple-500/20';
      default:
        return 'bg-white dark:bg-[#121821] text-slate-600 dark:text-[#A7B0BC] border-slate-100 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-[#161E28]';
    }
  };

  const getStatusBadgeDot = (status?: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-500';
      case 'absent': return 'bg-red-500';
      case 'half_day': return 'bg-amber-500';
      case 'late': return 'bg-amber-500';
      case 'on_leave': return 'bg-blue-500';
      case 'holiday': return 'bg-purple-500';
      default: return 'bg-slate-300 dark:bg-slate-600';
    }
  };

  const handleDayClick = (dayNum: number) => {
    const monthFormatted = String(month + 1).padStart(2, '0');
    const dayFormatted = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
    
    const record = records.find((r) => r.date === dateStr) || null;
    setSelectedRecord(record);
    setSelectedDateStr(dateStr);
    setIsPopoverOpen(true);
  };

  // Build grid days
  const calendarCells = [];
  // Empty padding cells before 1st day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(<div key={`pad-${i}`} className="h-20 bg-slate-50/40 dark:bg-white/[0.02] rounded-xl border border-transparent" />);
  }

  // Month days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthFormatted = String(month + 1).padStart(2, '0');
    const dayFormatted = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
    const dayOfWeek = new Date(year, month, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const record = records.find((r) => r.date === dateStr);
    const isToday = dateStr === todayStr;

    calendarCells.push(
      <button
        key={`day-${day}`}
        onClick={() => handleDayClick(day)}
        className={`h-20 rounded-2xl border p-2 flex flex-col justify-between text-left transition-all relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${getDayStyle(
          record?.status,
          isWeekend
        )} ${isToday ? '!border-teal-500 !ring-2 !ring-teal-500/30 shadow-md font-bold' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isToday ? 'bg-teal-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold' : 'font-semibold'}`}>
            {day}
          </span>
          {record && !isWeekend && (
            <span className={`w-2 h-2 rounded-full ${getStatusBadgeDot(record.status)}`} />
          )}
        </div>

        {record && !isWeekend ? (
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold block truncate capitalize opacity-90">
              {record.status.replace('_', ' ')}
            </span>
            <span className="text-[10px] opacity-75 font-medium block truncate">
              {record.checkIn || '—'}
            </span>
          </div>
        ) : isWeekend ? (
          <span className="text-[10px] font-bold text-slate-400 dark:text-[#707A87] block">Off</span>
        ) : (
          <span className="text-[10px] text-slate-300 dark:text-[#707A87] block">—</span>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Selector Bar */}
      <div className="bg-white dark:bg-[#121821] rounded-2xl p-4 border border-slate-100 dark:border-white/[0.07] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F5F7FA]">{monthName}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 border border-slate-200 dark:border-white/[0.08] rounded-xl hover:bg-slate-50 dark:hover:bg-[#161E28] text-slate-600 dark:text-[#A7B0BC] transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 border border-slate-200 dark:border-white/[0.08] rounded-xl hover:bg-slate-50 dark:hover:bg-[#161E28] text-slate-600 dark:text-[#A7B0BC] transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2.5 text-center font-bold text-xs text-slate-400 dark:text-[#707A87] uppercase tracking-wider px-1">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2.5">
        {calendarCells}
      </div>

      {/* Legend Footer */}
      <div className="bg-white dark:bg-[#121821] rounded-2xl p-4 border border-slate-100 dark:border-white/[0.07] shadow-xs flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-600 dark:text-[#A7B0BC]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" /> Present
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500" /> Late / Half Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" /> On Leave
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" /> Absent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500" /> Holiday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-white/[0.12]" /> Weekend Off
        </span>
      </div>

      {/* Popover */}
      <AttendanceDayPopover
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        record={selectedRecord}
        dateString={selectedDateStr}
      />
    </div>
  );
};
