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
      return 'bg-slate-100/70 text-slate-400 border-slate-200 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:8px_8px]';
    }
    switch (status) {
      case 'present':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80';
      case 'absent':
        return 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100/80';
      case 'half_day':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80';
      case 'late':
        return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/80';
      case 'on_leave':
        return 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100/80';
      case 'holiday':
        return 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100/80';
      default:
        return 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50';
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
      default: return 'bg-slate-300';
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
    calendarCells.push(<div key={`pad-${i}`} className="h-20 bg-slate-50/40 rounded-xl border border-transparent" />);
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
          <span className="text-[10px] font-bold text-slate-400 block">Off</span>
        ) : (
          <span className="text-[10px] text-slate-300 block">—</span>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-extrabold text-slate-900">{monthName}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2.5 text-center font-bold text-xs text-slate-400 uppercase tracking-wider px-1">
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
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-600">
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
          <span className="w-3 h-3 rounded-sm bg-slate-200" /> Weekend Off
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
