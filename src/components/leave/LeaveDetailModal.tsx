import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { LeaveRequest } from '../../types/leave';
import { StatusBadge } from '../ui/StatusBadge';

interface LeaveDetailModalProps {
  isOpen: boolean;
  request: LeaveRequest | null;
  onClose: () => void;
}

export const LeaveDetailModal: React.FC<LeaveDetailModalProps> = ({
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              {request.employeeAvatar}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{request.employeeName}</h3>
              <p className="text-xs text-slate-500">{request.department}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm text-slate-700">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
            <span className="text-xs font-semibold text-slate-500">Status</span>
            <StatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium block">Leave Type</span>
              <StatusBadge leaveType={request.leaveType} size="sm" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium block">Duration</span>
              <span className="font-bold text-slate-900">{request.days} Day{request.days > 1 ? 's' : ''}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium block">Start Date</span>
              <span className="font-semibold text-slate-800">{request.startDate}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 font-medium block">End Date</span>
              <span className="font-semibold text-slate-800">{request.endDate}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Reason for Leave</h4>
            <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
              {request.reason}
            </p>
          </div>

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="p-3 bg-red-50/80 border border-red-200/80 rounded-xl text-xs space-y-1">
              <span className="font-bold text-red-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-600" /> Rejection Audit Note:
              </span>
              <p className="text-red-900">{request.rejectionReason}</p>
            </div>
          )}

          {request.status === 'approved' && request.approvedBy && (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs flex items-center justify-between">
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved By:
              </span>
              <span className="text-emerald-950 font-bold">{request.approvedBy}</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
