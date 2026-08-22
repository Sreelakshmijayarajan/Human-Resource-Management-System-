import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Save 
} from 'lucide-react';
import { DepartmentItem, CompanyProfile, LeavePolicyItem } from '../../types/departments';
import { initialMockDepartments, initialCompanyProfile, initialLeavePolicies } from '../../data/mockDepartments';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

export const HRSettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = rawTab === 'leave-policies' ? 'leave-policies' : rawTab === 'company-profile' ? 'company-profile' : 'departments';
  const { showToast } = useToast();

  const [departments, setDepartments] = useState<DepartmentItem[]>(initialMockDepartments);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('Sanjay Kumar');

  const [deptToDelete, setDeptToDelete] = useState<DepartmentItem | null>(null);
  const [showDeleteBlockedModal, setShowDeleteBlockedModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [leavePolicies, setLeavePolicies] = useState<LeavePolicyItem[]>(initialLeavePolicies);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicyItem | null>(null);

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const setTab = (tab: 'departments' | 'leave-policies' | 'company-profile') => {
    setSearchParams(tab === 'departments' ? {} : { tab });
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      showToast('Department name is required', 'error');
      return;
    }

    const newDept: DepartmentItem = {
      id: `dept-${Date.now()}`,
      name: newDeptName.trim(),
      description: newDeptDesc.trim() || 'General business operations unit.',
      employeeCount: 0,
      headName: newDeptHead,
      headEmail: `${newDeptHead.toLowerCase().replace(' ', '.')}@dayflow.io`,
      headAvatarColor: 'bg-indigo-500',
      headInitials: newDeptHead.split(' ').map((n) => n[0]).join(''),
      createdAt: 'Just now',
    };

    setDepartments((prev) => [...prev, newDept]);
    setIsAddDeptOpen(false);
    setNewDeptName('');
    setNewDeptDesc('');
    showToast(`Department "${newDept.name}" created successfully!`, 'success');
  };

  const handleTriggerDelete = (dept: DepartmentItem) => {
    setDeptToDelete(dept);
    if (dept.employeeCount > 0) {
      setShowDeleteBlockedModal(true);
    } else {
      setShowDeleteConfirmModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deptToDelete) return;
    setDepartments((prev) => prev.filter((d) => d.id !== deptToDelete.id));
    setShowDeleteConfirmModal(false);
    showToast(`Department "${deptToDelete.name}" deleted`, 'info');
    setDeptToDelete(null);
  };

  const handleSavePolicy = (policy: LeavePolicyItem) => {
    setLeavePolicies((prev) => prev.map((p) => (p.id === policy.id ? policy : p)));
    setEditingPolicy(null);
    showToast(`Leave policy updated for ${policy.name}`, 'success');
  };

  const handleWeeklyOffToggle = (day: string) => {
    setCompanyProfile((prev) => {
      const exists = prev.weeklyOffDays.includes(day);
      return {
        ...prev,
        weeklyOffDays: exists ? prev.weeklyOffDays.filter((d) => d !== day) : [...prev.weeklyOffDays, day],
      };
    });
    setHasProfileChanges(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setHasProfileChanges(false);
      showToast('Company profile saved successfully!', 'success');
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div>
        <Link to="/hr/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0c8fe9] dark:text-[#36abf8] hover:text-[#0070c7] mb-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to HR Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
          Organization & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#707A87] mt-1">
          Configure departments, leave policies, working hours, and corporate profile.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#161E28] rounded-2xl w-fit overflow-x-auto border border-slate-200/60 dark:border-white/[0.06]">
        <button
          onClick={() => setTab('departments')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'departments'
              ? 'bg-white dark:bg-[#1B2531] text-slate-900 dark:text-[#F5F7FA] shadow-sm'
              : 'text-slate-600 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-[#E5E7EB]'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#0c8fe9]" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setTab('leave-policies')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'leave-policies'
              ? 'bg-white dark:bg-[#1B2531] text-slate-900 dark:text-[#F5F7FA] shadow-sm'
              : 'text-slate-600 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-[#E5E7EB]'
          }`}
        >
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Leave Policies</span>
        </button>

        <button
          onClick={() => setTab('company-profile')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'company-profile'
              ? 'bg-white dark:bg-[#1B2531] text-slate-900 dark:text-[#F5F7FA] shadow-sm'
              : 'text-slate-600 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-[#E5E7EB]'
          }`}
        >
          <Building className="w-4 h-4 text-blue-500" />
          <span>Company Profile</span>
          {hasProfileChanges && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
        </button>
      </div>

      {/* TAB: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121821] rounded-3xl p-5 border border-slate-100/90 dark:border-white/[0.07] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Organizational Structure & Units</h3>
              <p className="text-xs text-slate-500 dark:text-[#707A87] mt-0.5">
                Departments organize workforce management, leave approval hierarchies, and team metrics.
              </p>
            </div>
            <button
              onClick={() => setIsAddDeptOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0c8fe9] hover:bg-[#0070c7] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#0c8fe9]/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white dark:bg-[#121821] rounded-2xl p-5 border border-slate-100/90 dark:border-white/[0.07] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0c8fe9]/30 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#0c8fe9]/10 text-[#0c8fe9] dark:text-[#36abf8] flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-[#F5F7FA] text-sm">{dept.name}</h4>
                        <span className="text-[11px] font-semibold text-[#0c8fe9] dark:text-[#36abf8]">
                          {dept.employeeCount} Members
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTriggerDelete(dept)}
                      title="Delete Department"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#707A87] line-clamp-2 leading-relaxed">{dept.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${dept.headAvatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}>
                      {dept.headInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-[#E5E7EB] truncate">{dept.headName}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#707A87]">Department Lead</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-[#707A87] font-mono">{dept.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LEAVE POLICIES */}
      {activeTab === 'leave-policies' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121821] rounded-3xl p-5 border border-slate-100/90 dark:border-white/[0.07] shadow-xs space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Statutory Leave Allowances & Policies</h3>
            <p className="text-xs text-slate-500 dark:text-[#707A87]">
              Company-wide annual quotas for full-time employees. Day allowances reset annually on January 1st.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leavePolicies.map((policy) => (
              <div key={policy.id} className="bg-white dark:bg-[#121821] rounded-2xl p-5 border border-slate-100/90 dark:border-white/[0.07] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#0c8fe9]/30 transition-all">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${policy.iconColor}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-[#F5F7FA] text-sm">{policy.name}</h4>
                        <span className="text-xs font-extrabold text-[#0c8fe9] dark:text-[#36abf8]">{policy.days} Days / Year</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingPolicy(policy)}
                      className="p-1.5 text-slate-400 hover:text-[#0c8fe9] hover:bg-slate-100 dark:hover:bg-[#161E28] rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#707A87] leading-relaxed">{policy.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-[#707A87]">
                    Carry-Forward: <strong>{policy.carryForwardMax > 0 ? `${policy.carryForwardMax} days` : 'None'}</strong>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {policy.paid ? '100% Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: COMPANY PROFILE */}
      {activeTab === 'company-profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#121821] rounded-3xl p-6 border border-slate-100/90 dark:border-white/[0.07] shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-white/[0.06] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Corporate Profile & Working Schedule</h3>
                <p className="text-xs text-slate-500 dark:text-[#707A87] mt-0.5">
                  Official company details for employee payslips and portal communications.
                </p>
              </div>
              {hasProfileChanges && (
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-xl animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
              {[
                { label: 'Legal Entity Name', key: 'companyName' as const, type: 'text' },
                { label: 'Tax / GST Identification Number', key: 'taxId' as const, type: 'text' },
                { label: 'Work Email Domain', key: 'domain' as const, type: 'text' },
                { label: 'Official Contact Phone', key: 'phone' as const, type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">{label}</label>
                  <input
                    type={type}
                    value={companyProfile[key]}
                    onChange={(e) => { setCompanyProfile({ ...companyProfile, [key]: e.target.value }); setHasProfileChanges(true); }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#161E28] text-slate-900 dark:text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0c8fe9]/20"
                  />
                </div>
              ))}

              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Registered Headquarters Address</label>
                <input
                  type="text"
                  value={companyProfile.address}
                  onChange={(e) => { setCompanyProfile({ ...companyProfile, address: e.target.value }); setHasProfileChanges(true); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#161E28] text-slate-900 dark:text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0c8fe9]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Standard Shift Start</label>
                <input
                  type="time"
                  value={companyProfile.workStartTime}
                  onChange={(e) => { setCompanyProfile({ ...companyProfile, workStartTime: e.target.value }); setHasProfileChanges(true); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#161E28] text-slate-900 dark:text-[#E5E7EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Standard Shift End</label>
                <input
                  type="time"
                  value={companyProfile.workEndTime}
                  onChange={(e) => { setCompanyProfile({ ...companyProfile, workEndTime: e.target.value }); setHasProfileChanges(true); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#161E28] text-slate-900 dark:text-[#E5E7EB]"
                />
              </div>
            </div>

            {/* Weekly Off Days */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Weekly Statutory Off Days</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isOff = companyProfile.weeklyOffDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleWeeklyOffToggle(day)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isOff
                          ? 'border-[#0c8fe9] bg-[#0c8fe9]/10 text-[#0c8fe9] dark:text-[#36abf8]'
                          : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161E28] text-slate-600 dark:text-[#A7B0BC] hover:bg-slate-50 dark:hover:bg-[#1B2531]'
                      }`}
                    >
                      {isOff ? '✓ ' : ''}{day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0c8fe9] hover:bg-[#0070c7] text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-[#0c8fe9]/20 transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saving...' : 'Save Corporate Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* MODAL: Add Department */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleAddDepartment}
            className="w-full max-w-md bg-white dark:bg-[#161E28] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-white/[0.08] space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 className="font-extrabold text-slate-900 dark:text-[#F5F7FA] text-base">Create New Department</h3>
              <button type="button" onClick={() => setIsAddDeptOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-lg p-1">✕</button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Department Name *</label>
              <input
                type="text"
                placeholder="e.g. Legal & Corporate Compliance"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-sm text-slate-900 dark:text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0c8fe9]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Description</label>
              <textarea
                rows={2}
                placeholder="Brief summary of department responsibilities..."
                value={newDeptDesc}
                onChange={(e) => setNewDeptDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-xs text-slate-900 dark:text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0c8fe9]/20 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Department Head</label>
              <select
                value={newDeptHead}
                onChange={(e) => setNewDeptHead(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-xs sm:text-sm text-slate-800 dark:text-[#E5E7EB]"
              >
                <option value="Sanjay Kumar">Sanjay Kumar (Product)</option>
                <option value="Uma Umamaheshwari">Uma Umamaheshwari (HR)</option>
                <option value="Arjun Singh">Arjun Singh (Engineering)</option>
                <option value="Ananya Iyer">Ananya Iyer (Analytics)</option>
                <option value="Kavitha Reddy">Kavitha Reddy (Finance)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <button type="button" onClick={() => setIsAddDeptOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-[#A7B0BC] hover:bg-slate-50 dark:hover:bg-[#1B2531]">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#0c8fe9] hover:bg-[#0070c7] text-white text-xs font-bold shadow-md shadow-[#0c8fe9]/20">
                Create Department
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Edit Leave Policy */}
      {editingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#161E28] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-white/[0.08] space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-[#F5F7FA] text-base">Edit Policy: {editingPolicy.name}</h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Annual Allowance (Days)</label>
                <input
                  type="number"
                  value={editingPolicy.days}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, days: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-[#E5E7EB]">Maximum Carry Forward (Days)</label>
                <input
                  type="number"
                  value={editingPolicy.carryForwardMax}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, carryForwardMax: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <button onClick={() => setEditingPolicy(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-[#A7B0BC] hover:bg-slate-50 dark:hover:bg-[#1B2531]">
                Cancel
              </button>
              <button onClick={() => handleSavePolicy(editingPolicy)} className="px-5 py-2 rounded-xl bg-[#0c8fe9] hover:bg-[#0070c7] text-white text-xs font-bold shadow-md shadow-[#0c8fe9]/20">
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG: Blocked Delete */}
      <ConfirmDialog
        isOpen={showDeleteBlockedModal}
        title="Cannot Delete Active Department"
        message={`"${deptToDelete?.name}" has ${deptToDelete?.employeeCount} active employees. You must reassign all staff to another department before deleting this unit to protect payroll and attendance records.`}
        variant="danger"
        confirmText="Understood"
        cancelText="Close"
        onConfirm={() => setShowDeleteBlockedModal(false)}
        onClose={() => setShowDeleteBlockedModal(false)}
        onCancel={() => setShowDeleteBlockedModal(false)}
      />

      {/* DIALOG: Confirm Delete */}
      <ConfirmDialog
        isOpen={showDeleteConfirmModal}
        title={`Delete "${deptToDelete?.name}"?`}
        message={`Are you sure you want to permanently remove "${deptToDelete?.name}"? This department has 0 active employees and it's safe to delete.`}
        variant="danger"
        confirmText="Delete Department"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setShowDeleteConfirmModal(false)}
        onCancel={() => setShowDeleteConfirmModal(false)}
      />
    </div>
  );
};
