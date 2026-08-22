import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Eye,
  Trash2,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { initialMyLeaveBalances, initialMyLeaveRequests } from '../../data/mockMyLeave';
import { MyLeaveBalance, MyLeaveRequest } from '../../types/employeeLeave';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Toast, ToastMessage } from '../../components/ui/Toast';
import { ApplyLeaveModal } from '../../components/employee/leave/ApplyLeaveModal';
import { MyLeaveDetailModal } from '../../components/employee/leave/MyLeaveDetailModal';

type LeaveTab = 'pending' | 'approved' | 'rejected' | 'all';

export const LeavePage: React.FC = () => {
  const navigate = useNavigate();
  const [balances, setBalances] = useState<MyLeaveBalance[]>(initialMyLeaveBalances);
  const [requests, setRequests] = useState<MyLeaveRequest[]>(initialMyLeaveRequests);
  const [activeTab, setActiveTab] = useState<LeaveTab>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [viewingDetailRequest, setViewingDetailRequest] = useState<MyLeaveRequest | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    setToast({ id: `toast-${Date.now()}`, type, title, message: message || '' });
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (activeTab !== 'all' && req.status !== activeTab) {
        return false;
      }
      return true;
    });
  }, [requests, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  // Handlers
  const handleApplySubmit = (newReq: MyLeaveRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    // Deduct remaining balance temporarily for UI responsiveness
    setBalances((prev) =>
      prev.map((b) =>
        b.type === newReq.leaveType
          ? { ...b, used: b.used + newReq.days, remaining: Math.max(0, b.remaining - newReq.days) }
          : b
      )
    );
    setApplyModalOpen(false);
    setActiveTab('pending');
    setCurrentPage(1);
    showToast(
      'success',
      'Leave Application Submitted',
      `Your request for ${newReq.days} day(s) of ${newReq.leaveType.toUpperCase()} leave is pending HR approval.`
    );
  };

  const handleConfirmCancel = () => {
    if (!cancelingId) return;
    const target = requests.find((r) => r.id === cancelingId);
    setRequests((prev) => prev.filter((r) => r.id !== cancelingId));
    if (target) {
      setBalances((prev) =>
        prev.map((b) =>
          b.type === target.leaveType
            ? { ...b, used: Math.max(0, b.used - target.days), remaining: b.remaining + target.days }
            : b
        )
      );
    }
    setCancelingId(null);
    showToast('info', 'Request Canceled', 'Your pending leave application has been canceled.');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              My Leave Portal <Sparkles className="w-5 h-5 text-teal-500 fill-teal-500/20" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track your annual leave quotas, submit time-off requests, and monitor approval statuses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setApplyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {/* Top Leave Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((b) => {
          const percentUsed = Math.round((b.used / b.total) * 100);
          return (
            <div
              key={b.type}
              className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge leaveType={b.type} size="sm" />
                  <span className="text-xs font-bold text-slate-900">{b.remaining} Days Left</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">{b.remaining}</span>
                  <span className="text-xs text-slate-400 font-medium">/ {b.total} Total</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 space-y-1">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color}`} style={{ width: `${percentUsed}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>{b.used} Used</span>
                  <span>{percentUsed}% Used</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-4 overflow-x-auto">
        {(['pending', 'approved', 'rejected', 'all'] as LeaveTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const labels: Record<LeaveTab, string> = {
            pending: `Pending (${pendingCount})`,
            approved: 'Approved',
            rejected: 'Rejected',
            all: 'All Requests',
          };
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`py-3 px-3.5 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap capitalize ${
                isActive
                  ? 'border-teal-600 text-teal-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs overflow-hidden">
        {paginatedRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Leave Category</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Applied On</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <StatusBadge leaveType={req.leaveType} size="sm" />
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800">
                      <p className="font-semibold">{req.startDate}</p>
                      <p className="text-[11px] text-slate-400">to {req.endDate}</p>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{req.days} Day{req.days > 1 ? 's' : ''}</span>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-1 text-slate-600" title={req.reason}>
                        {req.reason}
                      </p>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {req.appliedOn}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingDetailRequest(req)}
                          className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === 'pending' && (
                          <button
                            onClick={() => setCancelingId(req.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
                            title="Cancel pending application"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center">
              <CalendarDays className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">
              {activeTab === 'pending'
                ? 'No pending leave applications'
                : activeTab === 'approved'
                ? 'No approved leave history'
                : activeTab === 'rejected'
                ? 'No rejected leave records'
                : 'No leave applications found'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Need time off? Click "+ Apply for Leave" to submit your application.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredRequests.length > itemsPerPage && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRequests.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} applications
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 font-semibold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={applyModalOpen}
        balances={balances}
        onSubmit={handleApplySubmit}
        onClose={() => setApplyModalOpen(false)}
      />

      <MyLeaveDetailModal
        isOpen={Boolean(viewingDetailRequest)}
        request={viewingDetailRequest}
        onClose={() => setViewingDetailRequest(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(cancelingId)}
        title="Cancel Leave Request?"
        message="Are you sure you want to cancel this pending leave application? Your remaining balance will be restored."
        confirmText="Cancel Request"
        variant="danger"
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelingId(null)}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
