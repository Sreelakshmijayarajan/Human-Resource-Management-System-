import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { initialLeaveRequests, initialLeavePolicies } from '../../data/mockLeaveRequests';
import { LeaveRequest, LeavePolicy } from '../../types/leave';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Toast, ToastMessage } from '../../components/ui/Toast';
import { LeaveRejectModal } from '../../components/leave/LeaveRejectModal';
import { LeaveDetailModal } from '../../components/leave/LeaveDetailModal';
import { LeavePolicyCard } from '../../components/leave/LeavePolicyCard';
import { LeavePolicyModal } from '../../components/leave/LeavePolicyModal';
import { TableSkeleton } from '../../components/ui/Skeletons';

type ActiveTab = 'pending' | 'approved' | 'rejected' | 'all' | 'policies';

export const LeaveApprovalsPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [policies, setPolicies] = useState<LeavePolicy[]>(initialLeavePolicies);
  const [activeTab, setActiveTab] = useState<ActiveTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modals state
  const [approveConfirmId, setApproveConfirmId] = useState<string | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<LeaveRequest | null>(null);
  const [detailRequest, setDetailRequest] = useState<LeaveRequest | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [deletingPolicy, setDeletingPolicy] = useState<LeavePolicy | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    setToast({ id: `toast-${Date.now()}`, type, title, message });
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Tab filter
      if (activeTab !== 'all' && activeTab !== 'policies' && req.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = req.employeeName.toLowerCase().includes(query);
        const matchesDept = req.department.toLowerCase().includes(query);
        if (!matchesName && !matchesDept) return false;
      }
      // Dept filter
      if (selectedDept !== 'all' && req.department !== selectedDept) {
        return false;
      }
      // Leave type filter
      if (selectedLeaveType !== 'all' && req.leaveType !== selectedLeaveType) {
        return false;
      }
      return true;
    });
  }, [requests, activeTab, searchQuery, selectedDept, selectedLeaveType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  // Stats calculation
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedThisMonth = requests.filter((r) => r.status === 'approved').length;
  const rejectedThisMonth = requests.filter((r) => r.status === 'rejected').length;
  const onLeaveToday = requests.filter((r) => r.status === 'approved' && r.startDate <= '2026-08-22' && r.endDate >= '2026-08-22').length + 2;

  // Handlers
  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved', approvedBy: 'Uma Umamaheshwari' } : r))
    );
    setApproveConfirmId(null);
    showToast('success', 'Leave Approved', 'The employee leave request has been successfully approved.');
  };

  const handleConfirmReject = (reason: string) => {
    if (!rejectingRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === rejectingRequest.id ? { ...r, status: 'rejected', rejectionReason: reason } : r
      )
    );
    setRejectingRequest(null);
    showToast('info', 'Leave Request Rejected', 'The request was rejected and audit note attached.');
  };

  const handleSavePolicy = (savedPolicy: LeavePolicy) => {
    if (editingPolicy) {
      setPolicies((prev) => prev.map((p) => (p.id === savedPolicy.id ? savedPolicy : p)));
      showToast('success', 'Policy Updated', `Leave policy "${savedPolicy.name}" updated successfully.`);
    } else {
      setPolicies((prev) => [...prev, savedPolicy]);
      showToast('success', 'Policy Created', `New leave policy "${savedPolicy.name}" added.`);
    }
    setPolicyModalOpen(false);
    setEditingPolicy(null);
  };

  const handleDeletePolicy = () => {
    if (!deletingPolicy) return;
    setPolicies((prev) => prev.filter((p) => p.id !== deletingPolicy.id));
    setDeletingPolicy(null);
    showToast('info', 'Policy Deleted', `Leave policy has been removed.`);
  };

  const departments = ['all', 'Engineering', 'Human Resources', 'Marketing', 'Finance', 'Design', 'Analytics', 'Sales'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Leave Management <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review employee leave requests, approve workflow, and manage organizational leave policies.
          </p>
        </div>

        {activeTab === 'policies' && (
          <button
            onClick={() => {
              setEditingPolicy(null);
              setPolicyModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Leave Policy
          </button>
        )}
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Requests</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved This Month</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedThisMonth}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejected Requests</span>
            <p className="text-2xl font-extrabold text-red-600 mt-1">{rejectedThisMonth}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On Leave Today</span>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">{onLeaveToday}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-1 sm:gap-4 overflow-x-auto">
        {(['pending', 'approved', 'rejected', 'all', 'policies'] as ActiveTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const labels: Record<ActiveTab, string> = {
            pending: `Pending (${pendingCount})`,
            approved: 'Approved',
            rejected: 'Rejected',
            all: 'All Requests',
            policies: 'Leave Policy Settings',
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
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* View Content: Leave Policy Settings vs Leave Requests */}
      {activeTab === 'policies' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Configure organizational leave allocations, carry-forward caps, and accrual types.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {policies.map((policy) => (
              <LeavePolicyCard
                key={policy.id}
                policy={policy}
                onEdit={(p) => {
                  setEditingPolicy(p);
                  setPolicyModalOpen(true);
                }}
                onDelete={(p) => setDeletingPolicy(p)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search employee name or department..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500 font-medium shrink-0">Dept:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d === 'all' ? 'All Departments' : d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 font-medium shrink-0">Type:</span>
                <select
                  value={selectedLeaveType}
                  onChange={(e) => {
                    setSelectedLeaveType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer capitalize"
                >
                  <option value="all">All Leave Types</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                  <option value="maternity_paternity">Maternity/Paternity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs overflow-hidden">
            {isLoading ? (
              <TableSkeleton rows={6} />
            ) : paginatedRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Employee</th>
                      <th className="py-3.5 px-4">Leave Type</th>
                      <th className="py-3.5 px-4">Dates</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Reason</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                    {paginatedRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Employee Avatar + Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {req.employeeAvatar}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{req.employeeName}</p>
                              <p className="text-[11px] text-slate-400">{req.department}</p>
                            </div>
                          </div>
                        </td>

                        {/* Leave Type */}
                        <td className="py-3.5 px-4">
                          <StatusBadge leaveType={req.leaveType} size="sm" />
                        </td>

                        {/* Dates */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-800">
                          <p className="font-semibold">{req.startDate}</p>
                          <p className="text-[11px] text-slate-400">to {req.endDate}</p>
                        </td>

                        {/* Days */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">{req.days} Day{req.days > 1 ? 's' : ''}</span>
                        </td>

                        {/* Reason */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="line-clamp-1 text-slate-600" title={req.reason}>
                            {req.reason}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={req.status} size="sm" />
                        </td>

                        {/* Row Actions */}
                        <td className="py-3.5 px-4 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setApproveConfirmId(req.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => setRejectingRequest(req)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-xl transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDetailRequest(req)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-xl transition-all ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>
                          )}
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
                <h4 className="text-sm font-bold text-slate-700">No leave requests found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {activeTab === 'pending'
                    ? 'All leave applications have been reviewed. High five!'
                    : 'Try clearing your search query or department filter.'}
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredRequests.length > itemsPerPage && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRequests.length)} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
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
        </div>
      )}

      {/* Modals */}
      <ConfirmDialog
        isOpen={Boolean(approveConfirmId)}
        title="Approve Leave Request?"
        message="Are you sure you want to approve this employee leave request? This will deduct days from their remaining quota."
        confirmText="Approve Leave"
        variant="success"
        onConfirm={() => approveConfirmId && handleApprove(approveConfirmId)}
        onClose={() => setApproveConfirmId(null)}
      />

      <LeaveRejectModal
        isOpen={Boolean(rejectingRequest)}
        request={rejectingRequest}
        onConfirmReject={handleConfirmReject}
        onClose={() => setRejectingRequest(null)}
      />

      <LeaveDetailModal
        isOpen={Boolean(detailRequest)}
        request={detailRequest}
        onClose={() => setDetailRequest(null)}
      />

      <LeavePolicyModal
        isOpen={policyModalOpen}
        policy={editingPolicy}
        onSave={handleSavePolicy}
        onClose={() => {
          setPolicyModalOpen(false);
          setEditingPolicy(null);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingPolicy)}
        title="Delete Leave Policy?"
        message={`Are you sure you want to delete policy "${deletingPolicy?.name}"? Employees won't be able to apply under this category.`}
        confirmText="Delete Policy"
        variant="danger"
        onConfirm={handleDeletePolicy}
        onClose={() => setDeletingPolicy(null)}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
