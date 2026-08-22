import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { LeaveRequest } from '../../types/leave';

interface LeaveRejectModalProps {
  isOpen: boolean;
  request: LeaveRequest | null;
  onConfirmReject: (reason: string) => void;
  onClose: () => void;
}

export const LeaveRejectModal: React.FC<LeaveRejectModalProps> = ({
  isOpen,
  request,
  onConfirmReject,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A rejection reason is mandatory for auditing purposes.');
      return;
    }
    onConfirmReject(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Reject Leave Request</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Employee: <span className="font-semibold text-slate-700">{request.employeeName}</span> ({request.department})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1">
            <p><span className="font-semibold">Leave Type:</span> {request.leaveType.toUpperCase()}</p>
            <p><span className="font-semibold">Dates:</span> {request.startDate} to {request.endDate} ({request.days} day{request.days > 1 ? 's' : ''})</p>
            <p><span className="font-semibold">Reason for Leave:</span> "{request.reason}"</p>
          </div>

          <div>
            <label htmlFor="rejectionReason" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="e.g. Critical project deadline, staffing shortage, invalid documentation..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                  : 'border-slate-200 focus:ring-indigo-500/30 focus:border-indigo-500'
              }`}
              autoFocus
            />
            {error && (
              <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
