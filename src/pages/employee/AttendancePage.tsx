import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';

export const AttendancePage: React.FC = () => {
  const { employeeData, updateAttendance } = useAppContext();
  const navigate = useNavigate();

  const attendance = employeeData.attendance;

  const mockLogs = [
    { date: 'Aug 21, 2026', checkIn: '09:05 AM', checkOut: '06:12 PM', status: 'Present', duration: '9h 07m' },
    { date: 'Aug 20, 2026', checkIn: '08:58 AM', checkOut: '06:00 PM', status: 'Present', duration: '9h 02m' },
    { date: 'Aug 19, 2026', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present', duration: '9h 15m' },
    { date: 'Aug 18, 2026', checkIn: '09:00 AM', checkOut: '06:05 PM', status: 'Present', duration: '9h 05m' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Attendance Log</h1>
          <p className="text-xs text-slate-500">Track daily check-ins, check-outs, and work shift hours.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900">Current Status: {attendance.status.replace('_', ' ').toUpperCase()}</h3>
            <p className="text-xs text-slate-500">
              {attendance.checkInTime ? `Checked in at ${attendance.checkInTime}` : 'Not checked in yet today'}
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (attendance.status === 'not_checked_in') updateAttendance('checked_in', now);
            else if (attendance.status === 'checked_in') updateAttendance('checked_out', now);
          }}
          className="!bg-teal-600 hover:!bg-teal-700 text-white font-bold px-6"
        >
          {attendance.status === 'not_checked_in' ? 'Check In Now' : attendance.status === 'checked_in' ? 'Check Out Now' : 'Shift Completed'}
        </Button>
      </div>

      {/* History table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm">
          Recent Timesheet Logs
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-6">Date</th>
                <th className="p-3.5">Check In</th>
                <th className="p-3.5">Check Out</th>
                <th className="p-3.5">Total Duration</th>
                <th className="p-3.5 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 pl-6 font-bold text-slate-900">{log.date}</td>
                  <td className="p-3.5 text-slate-600">{log.checkIn}</td>
                  <td className="p-3.5 text-slate-600">{log.checkOut}</td>
                  <td className="p-3.5 font-medium text-slate-700">{log.duration}</td>
                  <td className="p-3.5 pr-6 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
