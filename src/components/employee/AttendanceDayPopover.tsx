import React, { useEffect } from 'react';
import { MyAttendanceRecord } from '../../data/mockMyAttendance';
import { StatusBadge, BadgeStatus } from '../ui/StatusBadge';
import { X, Clock, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface AttendanceDayPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  record: MyAttendanceRecord | null;
  dateString?: string;
}

export const AttendanceDayPopover: React.FC<AttendanceDayPopoverProps> = ({
  isOpen,
  onClose,
  record,
  dateString,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayDate = record?.date || dateString || 'Selected Date';
  const formattedDate = new Date(displayDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Popover Card */}
      <div className="relative bg-white dark:bg-[#161E28] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up border border-slate-100 dark:border-white/[0.08] z-10">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50/80 dark:bg-[#121821] border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <h3 className="text-sm font-extrabold">{formattedDate}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] hover:bg-slate-200/60 dark:hover:bg-[#1B2531] rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#707A87]">Log Status</span>
            <StatusBadge status={(record?.status || 'present') as BadgeStatus} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-[#707A87] uppercase tracking-wider block mb-1">
                Check In
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-[#E5E7EB] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                {record?.checkIn || '—'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-[#707A87] uppercase tracking-wider block mb-1">
                Check Out
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-[#E5E7EB] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-[#36abf8]" />
                {record?.checkOut || '—'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-teal-50/50 dark:bg-teal-500/10 rounded-xl border border-teal-100/80 dark:border-teal-500/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Total Duration
            </span>
            <span className="text-sm font-extrabold text-teal-900 dark:text-teal-200">
              {record?.totalHours || '0h 00m'}
            </span>
          </div>

          {record?.notes && (
            <div className="flex items-start gap-2 pt-1 text-xs text-slate-500 font-medium">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{record.notes}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
