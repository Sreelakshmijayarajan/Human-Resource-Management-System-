import React, { useState, useEffect } from 'react';
import { X, Upload, AlertTriangle } from 'lucide-react';
import { LeaveType } from '../../../types/leave';
import { MyLeaveBalance, MyLeaveRequest } from '../../../types/employeeLeave';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  balances: MyLeaveBalance[];
  onSubmit: (newRequest: MyLeaveRequest) => void;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  balances,
  onSubmit,
  onClose,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLeaveType('casual');
      setStartDate('');
      setEndDate('');
      setReason('');
      setAttachment(null);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Selected balance info
  const selectedBalance = balances.find((b) => b.type === leaveType) || balances[0];

  // Helper to calculate days (excluding weekends)
  const calculateDays = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (end < start) return 0;

    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count || 1;
  };

  const requestedDays = calculateDays(startDate, endDate);
  const isExceedingQuota = requestedDays > (selectedBalance?.remaining || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for your leave request.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReq: MyLeaveRequest = {
        id: `my-lr-${Date.now()}`,
        leaveType,
        startDate,
        endDate,
        days: requestedDays,
        reason: reason.trim(),
        status: 'pending',
        appliedOn: new Date().toISOString().split('T')[0],
        attachmentName: attachment ? attachment.name : undefined,
      };

      setIsSubmitting(false);
      onSubmit(newReq);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#161E28] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/[0.08] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Apply for Leave</h3>
            <p className="text-xs text-slate-500 dark:text-[#707A87] mt-0.5">Submit time off request for manager approval.</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B2531] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Leave Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB]">Leave Category</label>
              <span className="text-xs font-bold text-[#0c8fe9] dark:text-[#36abf8] bg-[#0c8fe9]/10 px-2 py-0.5 rounded-md border border-[#0c8fe9]/20">
                {selectedBalance?.remaining || 0} Days Available
              </span>
            </div>
            <select
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value as LeaveType);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#0c8fe9]/20 focus:border-[#0c8fe9] outline-none"
            >
              <option value="casual">Casual Leave ({balances.find(b => b.type === 'casual')?.remaining} left)</option>
              <option value="sick">Sick Leave ({balances.find(b => b.type === 'sick')?.remaining} left)</option>
              <option value="earned">Earned Leave ({balances.find(b => b.type === 'earned')?.remaining} left)</option>
              <option value="unpaid">Unpaid Leave (LWP) ({balances.find(b => b.type === 'unpaid')?.remaining} left)</option>
            </select>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#0c8fe9]/20 focus:border-[#0c8fe9] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#0c8fe9]/20 focus:border-[#0c8fe9] outline-none"
              />
            </div>
          </div>

          {/* Duration Badge & Live Warning */}
          {requestedDays > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#707A87] font-medium">Calculated Duration:</span>
                <span className="font-extrabold text-slate-900 dark:text-[#F5F7FA]">{requestedDays} Working Day{requestedDays > 1 ? 's' : ''}</span>
              </div>
              {isExceedingQuota && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  Warning: Requested days exceed remaining quota ({selectedBalance?.remaining} left). Extra days may be converted to Loss of Pay.
                </p>
              )}
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] mb-1">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g. Doctor appointment, family function out of station..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#0c8fe9]/20 focus:border-[#0c8fe9] outline-none"
            />
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] mb-1">
              Document Attachment (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] bg-slate-100 dark:bg-[#121821] hover:bg-slate-200 dark:hover:bg-[#1B2531] rounded-xl cursor-pointer transition-colors border border-slate-200 dark:border-white/[0.08]">
                <Upload className="w-4 h-4 text-slate-500 dark:text-[#707A87]" />
                <span>{attachment ? attachment.name : 'Choose File'}</span>
                <input
                  type="file"
                  onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                />
              </label>
              {attachment && (
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-[#E5E7EB] border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] rounded-xl hover:bg-slate-50 dark:hover:bg-[#1B2531] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0c8fe9] hover:bg-[#0070c7] rounded-xl shadow-xs transition-colors disabled:opacity-60 flex items-center gap-1.5"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
