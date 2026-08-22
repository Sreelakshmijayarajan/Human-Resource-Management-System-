import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { AttendanceRecord } from '../../../types';
import { cn } from '../../../components/ui/StatusBadge';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onSave: (recordId: string, correction: { oldStatus: string, newStatus: string, oldCheckIn?: string | null, oldCheckOut?: string | null, reason: string }) => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({ isOpen, onClose, record, onSave }) => {
  const [status, setStatus] = useState<string>('present');
  const [reason, setReason] = useState('');
  
  useEffect(() => {
    if (isOpen && record) {
      setStatus(record.status);
      setReason('');
    }
  }, [isOpen, record]);

  if (!isOpen || !record) return null;

  const handleSave = () => {
    if (!reason.trim()) return;
    
    onSave(record.id, {
      oldStatus: record.status,
      newStatus: status,
      oldCheckIn: record.checkIn,
      oldCheckOut: record.checkOut,
      reason: reason.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Correct Attendance
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
            <p className="text-sm font-semibold text-slate-900">{record.employeeName}</p>
            <p className="text-xs text-slate-500 mt-1">{new Date(record.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-indigo-400 focus:ring-indigo-100 bg-white"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half_day">Half Day</option>
              <option value="late">Late</option>
              <option value="on_leave">On Leave</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Correction <span className="text-red-500">*</span></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Employee forgot to clock in"
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 resize-none",
                !reason.trim() ? "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100" : "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200"
              )}
            />
            {!reason.trim() && <p className="text-xs text-red-500 mt-1">Reason is required for audit trail.</p>}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!reason.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Correction
          </button>
        </div>
      </div>
    </div>
  );
};
