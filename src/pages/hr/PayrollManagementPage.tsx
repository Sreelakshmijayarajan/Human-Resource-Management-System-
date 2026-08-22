import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Clock,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { initialPayrollRecords } from '../../data/mockPayroll';
import { PayrollRecord } from '../../types/payroll';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Toast, ToastMessage } from '../../components/ui/Toast';
import { GeneratePayslipsModal } from '../../components/payroll/GeneratePayslipsModal';
import { SalaryStructureModal } from '../../components/payroll/SalaryStructureModal';
import { PayslipViewModal } from '../../components/payroll/PayslipViewModal';
import { TableSkeleton } from '../../components/ui/Skeletons';

export const PayrollManagementPage: React.FC = () => {
  const [records, setRecords] = useState<PayrollRecord[]>(initialPayrollRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [isLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [viewingPayslipRecord, setViewingPayslipRecord] = useState<PayrollRecord | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    setToast({ id: `toast-${Date.now()}`, type, title, message: message || '' });
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = rec.employeeName.toLowerCase().includes(query);
        const matchesDept = rec.department.toLowerCase().includes(query);
        const matchesDesig = rec.designation.toLowerCase().includes(query);
        if (!matchesName && !matchesDept && !matchesDesig) return false;
      }
      if (selectedDept !== 'all' && rec.department !== selectedDept) return false;
      if (selectedStatus !== 'all' && rec.status !== selectedStatus) return false;
      return true;
    });
  }, [records, searchQuery, selectedDept, selectedStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  // Stats calculation
  const totalMonthlyPayroll = records.reduce((acc, curr) => acc + curr.netSalary, 0);
  const employeesPaidCount = records.filter((r) => r.status === 'paid').length;
  const pendingPayslipsCount = records.filter((r) => r.status === 'pending').length;

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  // Handlers
  const handleBatchGenerateComplete = (count: number, month: string) => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'paid',
        lastPayslipDate: '2026-08-31',
      }))
    );
    setIsGenerateModalOpen(false);
    showToast(
      'success',
      'Payslips Generated!',
      `Successfully processed ${count} employee payslips for ${month}.`
    );
  };

  const handleSaveStructure = (updatedRecord: PayrollRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
    setEditingRecord(null);
    showToast(
      'success',
      'Salary Structure Updated',
      `Recalculated Net Pay for ${updatedRecord.employeeName}: ${formatCurrency(updatedRecord.netSalary)}`
    );
  };

  const departments = ['all', 'Engineering', 'Human Resources', 'Marketing', 'Finance', 'Design', 'Analytics', 'Sales', 'Product', 'Quality Assurance', 'Operations'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight flex items-center gap-2">
            Payroll Management <Sparkles className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#707A87] mt-1">
            Manage employee salary structures, process batch disbursements, and generate official payslips.
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Zap className="w-4 h-4 fill-white/20" /> Generate Batch Payslips
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-[#707A87] uppercase tracking-wider">Total Monthly Payroll</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] mt-1">{formatCurrency(totalMonthlyPayroll)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#0c8fe9] dark:text-[#36abf8] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-[#707A87] uppercase tracking-wider">Employees Paid</span>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{employeesPaidCount} / {records.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-[#707A87] uppercase tracking-wider">Pending Payslips</span>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingPayslipsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-[#707A87] uppercase tracking-wider">Next Payroll Date</span>
            <p className="text-base font-extrabold text-slate-800 dark:text-[#E5E7EB] mt-1">Aug 31, 2026</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#707A87] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search employee, designation, department..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#161E28] text-slate-900 dark:text-[#E5E7EB] placeholder-slate-400 dark:placeholder-[#707A87] rounded-xl border border-slate-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#161E28] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-[#707A87] shrink-0" />
            <span className="text-slate-500 dark:text-[#707A87] font-medium shrink-0">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-800 dark:text-[#E5E7EB] font-semibold focus:outline-none text-xs cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#161E28] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs">
            <span className="text-slate-500 dark:text-[#707A87] font-medium shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-800 dark:text-[#E5E7EB] font-semibold focus:outline-none text-xs cursor-pointer capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={7} />
        ) : paginatedRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-[#161E28] border-b border-slate-100 dark:border-white/[0.06] text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#707A87]">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department & Designation</th>
                  <th className="py-3.5 px-4">Gross Salary</th>
                  <th className="py-3.5 px-4">Net Salary</th>
                  <th className="py-3.5 px-4">Last Payslip</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs text-slate-700 dark:text-[#A7B0BC] font-medium">
                {paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-[#1B2531]/60 transition-colors">
                    {/* Employee Avatar + Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${rec.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                          {rec.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-[#E5E7EB]">{rec.employeeName}</p>
                          <p className="text-[11px] text-slate-400 dark:text-[#707A87]">{rec.employeeId.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department & Designation */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-[#E5E7EB]">{rec.designation}</p>
                      <p className="text-[11px] text-slate-400 dark:text-[#707A87]">{rec.department}</p>
                    </td>

                    {/* Gross Salary */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-[#E5E7EB]">
                      {formatCurrency(rec.grossSalary)}
                    </td>

                    {/* Net Salary */}
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(rec.netSalary)}
                    </td>

                    {/* Last Payslip */}
                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#707A87] whitespace-nowrap">
                      {rec.lastPayslipDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={rec.status} size="sm" />
                    </td>

                    {/* Row Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingPayslipRecord(rec)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#A7B0BC] hover:text-[#0c8fe9] dark:hover:text-[#36abf8] bg-slate-100 dark:bg-[#161E28] hover:bg-[#0c8fe9]/10 rounded-xl transition-all"
                          title="View Payslip"
                        >
                          <Eye className="w-3.5 h-3.5" /> Payslip
                        </button>
                        <button
                          onClick={() => setEditingRecord(rec)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#A7B0BC] hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-100 dark:bg-[#161E28] hover:bg-emerald-500/10 rounded-xl transition-all"
                          title="Edit Structure"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Structure
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center text-slate-400 dark:text-[#707A87] space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 dark:bg-[#161E28] flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-slate-300 dark:text-[#4A5568]" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-[#E5E7EB]">No payroll records match filters</h4>
            <p className="text-xs text-slate-400 dark:text-[#707A87] max-w-sm mx-auto">
              Try adjusting your search query or department/status filters.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredRecords.length > itemsPerPage && (
          <div className="p-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-[#707A87]">
            <span>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRecords.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} employees
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-[#A7B0BC] hover:bg-slate-50 dark:hover:bg-[#161E28] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 font-semibold text-slate-800 dark:text-[#E5E7EB]">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-[#A7B0BC] hover:bg-slate-50 dark:hover:bg-[#161E28] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GeneratePayslipsModal
        isOpen={isGenerateModalOpen}
        onGenerateComplete={handleBatchGenerateComplete}
        onClose={() => setIsGenerateModalOpen(false)}
      />

      <SalaryStructureModal
        isOpen={Boolean(editingRecord)}
        record={editingRecord}
        onSave={handleSaveStructure}
        onClose={() => setEditingRecord(null)}
      />

      <PayslipViewModal
        isOpen={Boolean(viewingPayslipRecord)}
        record={viewingPayslipRecord}
        onClose={() => setViewingPayslipRecord(null)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
