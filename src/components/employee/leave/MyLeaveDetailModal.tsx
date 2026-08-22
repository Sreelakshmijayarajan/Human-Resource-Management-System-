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
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Leave Request Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-500">Current Status</span>
            <StatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium block">Category</span>
              <StatusBadge leaveType={request.leaveType} size="sm" />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium block">Total Duration</span>
              <span className="font-bold text-slate-900 text-sm">{request.days} Day{request.days > 1 ? 's' : ''}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium block">Start Date</span>
              <span className="font-semibold text-slate-800">{request.startDate}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium block">End Date</span>
              <span className="font-semibold text-slate-800">{request.endDate}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-1">Reason Submitted</span>
            <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
              {request.reason}
            </p>
          </div>

          {request.attachmentName && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="font-medium text-slate-600 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-slate-400" /> {request.attachmentName}
              </span>
              <span className="text-[11px] font-bold text-teal-600">Attached</span>
            </div>
          )}

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <span className="font-bold text-red-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-600" /> HR Rejection Reason:
              </span>
              <p className="text-red-900 leading-relaxed">{request.rejectionReason}</p>
            </div>
          )}

          {request.status === 'approved' && request.approvedBy && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
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
