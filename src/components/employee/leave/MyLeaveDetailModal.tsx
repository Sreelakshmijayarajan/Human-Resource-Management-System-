import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle, Paperclip } from 'lucide-react';
import { MyLeaveRequest } from '../../../types/employeeLeave';
import { StatusBadge } from '../../ui/StatusBadge';

interface MyLeaveDetailModalProps {
  isOpen: boolean;
  request: MyLeaveRequest | null;
  onClose: () => void;
}

export const MyLeaveDetailModal: React.FC<MyLeaveDetailModalProps> = ({
  isOpen,
  request,
  onClose,
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

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#161E28] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Leave Request Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B2531] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700 dark:text-[#E5E7EB]">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-[#121821] p-3 rounded-xl border border-slate-100 dark:border-white/[0.06]">
            <span className="font-semibold text-slate-500 dark:text-[#707A87]">Current Status</span>
            <StatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06] space-y-1">
              <span className="text-slate-400 dark:text-[#707A87] font-medium block">Category</span>
              <StatusBadge leaveType={request.leaveType} size="sm" />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06] space-y-1">
              <span className="text-slate-400 dark:text-[#707A87] font-medium block">Total Duration</span>
              <span className="font-bold text-slate-900 dark:text-[#F5F7FA] text-sm">{request.days} Day{request.days > 1 ? 's' : ''}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06] space-y-1">
              <span className="text-slate-400 dark:text-[#707A87] font-medium block">Start Date</span>
              <span className="font-semibold text-slate-800 dark:text-[#E5E7EB]">{request.startDate}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06] space-y-1">
              <span className="text-slate-400 dark:text-[#707A87] font-medium block">End Date</span>
              <span className="font-semibold text-slate-800 dark:text-[#E5E7EB]">{request.endDate}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 dark:text-[#707A87] font-medium block mb-1">Reason Submitted</span>
            <p className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06] text-slate-700 dark:text-[#E5E7EB] leading-relaxed">
              {request.reason}
            </p>
          </div>

          {request.attachmentName && (
            <div className="p-3 bg-slate-50 dark:bg-[#121821] rounded-xl border border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <span className="font-medium text-slate-600 dark:text-[#A7B0BC] flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-slate-400 dark:text-[#707A87]" /> {request.attachmentName}
              </span>
              <span className="text-[11px] font-bold text-[#0c8fe9] dark:text-[#36abf8]">Attached</span>
            </div>
          )}

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl space-y-1">
              <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> HR Rejection Reason:
              </span>
              <p className="text-red-900 dark:text-red-300 leading-relaxed">{request.rejectionReason}</p>
            </div>
          )}

          {request.status === 'approved' && request.approvedBy && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Approved By:
              </span>
              <span className="text-emerald-950 dark:text-emerald-300 font-bold">{request.approvedBy}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-[#121821] hover:bg-slate-200 dark:hover:bg-[#1B2531] text-slate-700 dark:text-[#E5E7EB] font-semibold text-xs rounded-xl transition-colors border dark:border-white/[0.08]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
