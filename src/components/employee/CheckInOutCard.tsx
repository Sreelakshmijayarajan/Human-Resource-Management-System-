import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, LogOut, LogIn, Timer } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

interface CheckInOutCardProps {
  className?: string;
  compact?: boolean;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({ className = '' }) => {
  const { employeeData, updateAttendance } = useAppContext();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);

  const attendance = employeeData.attendance;

  // Live timer calculation when checked in
  useEffect(() => {
    let interval: any = null;
    if (attendance.status === 'checked_in') {
      // Calculate initial elapsed based on check-in time or start counter
      setElapsedMinutes(258); // ~4h 18m mock starting baseline for demo
      interval = setInterval(() => {
        setElapsedMinutes((prev) => prev + 1);
      }, 60000);
    } else {
      setElapsedMinutes(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [attendance.status]);

  const formatElapsed = (totalMin: number) => {
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${hrs}h ${mins < 10 ? '0' + mins : mins}m`;
  };

  const handleToggle = () => {
    setIsProcessing(true);
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setTimeout(() => {
      if (attendance.status === 'not_checked_in') {
        updateAttendance('checked_in', nowTime);
        showToast(`Checked in successfully at ${nowTime}`, 'success');
      } else if (attendance.status === 'checked_in') {
        updateAttendance('checked_out', nowTime);
        showToast(`Checked out successfully at ${nowTime}`, 'info');
      } else {
        // Toggle back to checked_in for demo flexibility
        updateAttendance('checked_in', nowTime);
        showToast(`Shift restarted at ${nowTime}`, 'success');
      }
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        
        {/* Status Info */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-colors ${
            attendance.status === 'checked_in' 
              ? 'bg-teal-50 text-teal-600 ring-2 ring-teal-500/20' 
              : attendance.status === 'checked_out'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-slate-100 text-slate-500'
          }`}>
            <Clock className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {attendance.status === 'checked_in'
                  ? 'Active Shift'
                  : attendance.status === 'checked_out'
                  ? 'Shift Completed'
                  : 'Not Checked In'}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                attendance.status === 'checked_in'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : attendance.status === 'checked_out'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {attendance.status === 'checked_in' && <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />}
                {attendance.status === 'checked_in' ? 'Working' : attendance.status === 'checked_out' ? 'Logged Out' : 'Off Duty'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
              <span>
                {attendance.status === 'checked_in'
                  ? `Checked in at ${attendance.checkInTime || '09:14 AM'}`
                  : attendance.status === 'checked_out'
                  ? `Checked out at ${attendance.checkOutTime || '06:02 PM'}`
                  : 'Shift schedule: 09:00 AM – 06:00 PM'}
              </span>
            </p>
          </div>
        </div>

        {/* Live Elapsed Hours Counter (If Checked In) */}
        {attendance.status === 'checked_in' && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-teal-50/70 border border-teal-100 rounded-xl text-teal-800 text-xs font-bold">
            <Timer className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{formatElapsed(elapsedMinutes)} elapsed today</span>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleToggle}
          disabled={isProcessing}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2.5 focus:ring-2 focus:ring-offset-2 disabled:opacity-60 ${
            attendance.status === 'not_checked_in'
              ? 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 shadow-teal-600/20'
              : attendance.status === 'checked_in'
              ? 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900'
              : 'bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-700 focus:ring-teal-500'
          }`}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : attendance.status === 'not_checked_in' ? (
            <>
              <LogIn className="w-4 h-4" /> Check In Now
            </>
          ) : attendance.status === 'checked_in' ? (
            <>
              <LogOut className="w-4 h-4" /> Check Out
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-teal-600" /> Start Extra Shift
            </>
          )}
        </button>

      </div>
    </div>
  );
};
