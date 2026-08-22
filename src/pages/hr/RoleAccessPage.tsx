import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft, 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  Save, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  UserX
} from 'lucide-react';
import { UserRoleItem, CategoryPermissionConfig, PermissionCategoryKey } from '../../types/roles';
import { initialMockUsers, initialPermissionMatrix } from '../../data/mockRoles';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

export const RoleAccessPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') === 'permissions' ? 'permissions' : 'users';
  const { showToast } = useToast();

  const [users, setUsers] = useState<UserRoleItem[]>(initialMockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'employee' | 'hr_admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const [targetUser, setTargetUser] = useState<UserRoleItem | null>(null);
  const [newRoleToAssign, setNewRoleToAssign] = useState<'employee' | 'hr_admin'>('employee');
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const [userToRemove, setUserToRemove] = useState<UserRoleItem | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const [permissionsMatrix, setPermissionsMatrix] = useState<CategoryPermissionConfig[]>(initialPermissionMatrix);
  const [hasMatrixChanges, setHasMatrixChanges] = useState(false);
  const [showSaveMatrixConfirm, setShowSaveMatrixConfirm] = useState(false);
  const [isSavingMatrix, setIsSavingMatrix] = useState(false);

  const handleTabChange = (tab: 'users' | 'permissions') => {
    setSearchParams(tab === 'permissions' ? { tab: 'permissions' } : {});
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchDept = u.department.toLowerCase().includes(q);
      const matchTitle = u.jobTitle.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchDept && !matchTitle) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openChangeRoleDialog = (user: UserRoleItem) => {
    setTargetUser(user);
    setNewRoleToAssign(user.role === 'hr_admin' ? 'employee' : 'hr_admin');
    setShowRoleConfirm(true);
  };

  const handleConfirmRoleChange = () => {
    if (!targetUser) return;
    setIsUpdatingRole(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => u.id === targetUser.id ? { ...u, role: newRoleToAssign } : u)
      );
      setIsUpdatingRole(false);
      setShowRoleConfirm(false);
      showToast(
        `Role updated: ${targetUser.name} → ${newRoleToAssign === 'hr_admin' ? 'HR Admin' : 'Employee'}`,
        'success'
      );
      setTargetUser(null);
    }, 500);
  };

  const handleConfirmRemoveAccess = () => {
    if (!userToRemove) return;
    setUsers((prev) =>
      prev.map((u) => u.id === userToRemove.id ? { ...u, status: 'inactive' } : u)
    );
    setShowRemoveConfirm(false);
    showToast(`Access revoked for ${userToRemove.name}`, 'info');
    setUserToRemove(null);
  };

  const togglePermission = (
    categoryKey: PermissionCategoryKey,
    role: 'employee' | 'hr_admin',
    action: 'view' | 'edit' | 'delete'
  ) => {
    setPermissionsMatrix((prev) =>
      prev.map((cat) => {
        if (cat.key !== categoryKey) return cat;
        if (cat[role].locked && action === 'view') return cat;
        return { ...cat, [role]: { ...cat[role], [action]: !cat[role][action] } };
      })
    );
    setHasMatrixChanges(true);
  };

  const handleConfirmSaveMatrix = () => {
    setIsSavingMatrix(true);
    setTimeout(() => {
      setIsSavingMatrix(false);
      setHasMatrixChanges(false);
      setShowSaveMatrixConfirm(false);
      showToast('System permissions updated company-wide', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/hr/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0c8fe9] dark:text-[#36abf8] hover:text-[#0070c7] mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to HR Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
            Role & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#707A87] mt-1">
            Manage user roles, administrative permissions, and security matrices across the organization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-[#121821] px-3.5 py-2 rounded-2xl border border-slate-100/90 dark:border-white/[0.07] text-center shadow-xs">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#707A87]">HR Admins</p>
            <p className="text-sm font-extrabold text-[#0c8fe9] dark:text-[#36abf8]">
              {users.filter((u) => u.role === 'hr_admin').length} Users
            </p>
          </div>
          <div className="bg-white dark:bg-[#121821] px-3.5 py-2 rounded-2xl border border-slate-100/90 dark:border-white/[0.07] text-center shadow-xs">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#707A87]">Employees</p>
            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {users.filter((u) => u.role === 'employee').length} Users
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#161E28] rounded-2xl w-fit border border-slate-200/60 dark:border-white/[0.06]">
        <button
          onClick={() => handleTabChange('users')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            currentTab === 'users'
              ? 'bg-white dark:bg-[#1B2531] text-slate-900 dark:text-[#F5F7FA] shadow-sm'
              : 'text-slate-600 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-[#E5E7EB]'
          }`}
        >
          <Users className="w-4 h-4 text-[#0c8fe9]" />
          <span>Users & Assigned Roles</span>
        </button>

        <button
          onClick={() => handleTabChange('permissions')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            currentTab === 'permissions'
              ? 'bg-white dark:bg-[#1B2531] text-slate-900 dark:text-[#F5F7FA] shadow-sm'
              : 'text-slate-600 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-[#E5E7EB]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#0c8fe9]" />
          <span>Permissions Matrix</span>
          {hasMatrixChanges && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
        </button>
      </div>

      {/* TAB: USERS & ROLES */}
      {currentTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121821] rounded-3xl p-4 sm:p-5 border border-slate-100/90 dark:border-white/[0.07] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 dark:text-[#707A87] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name, email, or department..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#161E28] text-slate-900 dark:text-[#E5E7EB] placeholder-slate-400 dark:placeholder-[#707A87] focus:outline-none focus:ring-2 focus:ring-[#0c8fe9]/20"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161E28] text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-[#707A87]" />
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value as any); setCurrentPage(1); }}
                className="bg-transparent font-medium text-xs text-slate-800 dark:text-[#E5E7EB] focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="hr_admin">HR / Admin Only</option>
                <option value="employee">Employees Only</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121821] rounded-3xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 dark:bg-[#161E28] border-b border-slate-100 dark:border-white/[0.06] text-[11px] font-bold uppercase text-slate-400 dark:text-[#707A87] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-4">Department & Title</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 dark:text-[#707A87]">
                        No users match the search filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1B2531]/40 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${user.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                              {user.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-[#E5E7EB] truncate">{user.name}</p>
                              <p className="text-[11px] text-slate-400 dark:text-[#707A87] truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800 dark:text-[#E5E7EB]">{user.department}</p>
                          <p className="text-[11px] text-slate-400 dark:text-[#707A87]">{user.jobTitle}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          {user.role === 'hr_admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0c8fe9]/10 text-[#0c8fe9] dark:text-[#36abf8] ring-1 ring-[#0c8fe9]/20">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>HR / Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200/80 dark:ring-emerald-500/20">
                              <Users className="w-3.5 h-3.5" />
                              <span>Employee</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <StatusBadge status={user.status} />
                            <p className="text-[11px] text-slate-400 dark:text-[#707A87]">{user.lastActive}</p>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openChangeRoleDialog(user)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161E28] hover:bg-[#0c8fe9]/10 hover:text-[#0c8fe9] dark:hover:text-[#36abf8] text-xs font-semibold text-slate-700 dark:text-[#A7B0BC] transition-colors"
                            >
                              Change Role
                            </button>

                            {user.status === 'active' ? (
                              <button
                                onClick={() => { setUserToRemove(user); setShowRemoveConfirm(true); }}
                                title="Revoke Access"
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold uppercase">Suspended</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-[#707A87]">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-[#161E28] text-slate-600 dark:text-[#A7B0BC] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-slate-800 dark:text-[#E5E7EB]">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-[#161E28] text-slate-600 dark:text-[#A7B0BC] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PERMISSIONS MATRIX */}
      {currentTab === 'permissions' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#0c8fe9]/8 dark:bg-[#161E28] p-4 sm:p-5 rounded-3xl border border-[#0c8fe9]/20 dark:border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0c8fe9]" />
                Granular Role Privileges Matrix
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A7B0BC]">
                Configure module-level access. Locked baseline rights ensure employees can always view their profile and timesheet.
              </p>
            </div>

            <button
              onClick={() => setShowSaveMatrixConfirm(true)}
              disabled={!hasMatrixChanges || isSavingMatrix}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
                hasMatrixChanges
                  ? 'bg-[#0c8fe9] hover:bg-[#0070c7] text-white active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-[#121821] border dark:border-white/[0.08] text-slate-400 dark:text-[#707A87] cursor-not-allowed shadow-none'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSavingMatrix ? 'Saving...' : 'Save Permissions'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#121821] rounded-3xl border border-slate-100/90 dark:border-white/[0.07] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 dark:bg-[#161E28] border-b border-slate-100 dark:border-white/[0.06] text-[11px] font-bold uppercase text-slate-400 dark:text-[#707A87] tracking-wider">
                  <tr>
                    <th className="py-4 px-6 w-1/3">Module & Resource</th>
                    <th className="py-4 px-6 text-center border-l border-slate-100 dark:border-white/[0.06] bg-blue-50/30 dark:bg-blue-500/5">
                      <div className="flex items-center justify-center gap-1.5 text-blue-700 dark:text-blue-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>Employee Role</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center border-l border-slate-100 dark:border-white/[0.06] bg-indigo-50/30 dark:bg-[#0c8fe9]/5">
                      <div className="flex items-center justify-center gap-1.5 text-[#0070c7] dark:text-[#36abf8]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>HR / Admin Role</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {permissionsMatrix.map((cat) => (
                    <tr key={cat.key} className="hover:bg-slate-50/50 dark:hover:bg-[#1B2531]/40 transition-colors">
                      <td className="py-5 px-6 space-y-1">
                        <p className="font-bold text-slate-900 dark:text-[#F5F7FA] text-sm">{cat.label}</p>
                        <p className="text-xs text-slate-500 dark:text-[#707A87] leading-relaxed max-w-sm">{cat.description}</p>
                        {cat.employee.locked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-[#707A87] pt-1">
                            <Lock className="w-3 h-3 text-amber-500" />
                            <span>{cat.employee.lockedDescription}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-5 px-6 border-l border-slate-100 dark:border-white/[0.06] bg-blue-50/10 dark:bg-blue-500/[0.03]">
                        <div className="flex items-center justify-center gap-4">
                          {(['view', 'edit', 'delete'] as const).map((action) => (
                            <label key={action} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#A7B0BC] cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={cat.employee[action]}
                                disabled={cat.employee.locked && action === 'view'}
                                onChange={() => togglePermission(cat.key, 'employee', action)}
                                className="rounded border-slate-300 dark:border-white/[0.2] text-[#0c8fe9] focus:ring-[#0c8fe9] disabled:opacity-50"
                              />
                              <span className="capitalize">{action === 'edit' ? 'Apply' : action}</span>
                            </label>
                          ))}
                        </div>
                      </td>

                      <td className="py-5 px-6 border-l border-slate-100 dark:border-white/[0.06] bg-indigo-50/10 dark:bg-[#0c8fe9]/[0.03]">
                        <div className="flex items-center justify-center gap-4">
                          {(['view', 'edit', 'delete'] as const).map((action) => (
                            <label key={action} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#A7B0BC] cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={cat.hr_admin[action]}
                                onChange={() => togglePermission(cat.key, 'hr_admin', action)}
                                className="rounded border-slate-300 dark:border-white/[0.2] text-[#0c8fe9] focus:ring-[#0c8fe9]"
                              />
                              <span className="capitalize">{action === 'edit' ? 'Manage' : action}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation: Change Role */}
      <ConfirmDialog
        isOpen={showRoleConfirm}
        title={`Change Role for ${targetUser?.name}?`}
        message={
          newRoleToAssign === 'hr_admin'
            ? `This will elevate ${targetUser?.name} to HR Administrator, granting full operational access to employee records, payroll, leave approvals, and settings.`
            : `This will restrict ${targetUser?.name} to standard Employee Self-Service access. They will lose access to the HR management portal.`
        }
        variant={newRoleToAssign === 'hr_admin' ? 'danger' : 'primary'}
        confirmText={`Assign ${newRoleToAssign === 'hr_admin' ? 'HR / Administrator' : 'Standard Employee'}`}
        cancelText="Cancel"
        isLoading={isUpdatingRole}
        onConfirm={handleConfirmRoleChange}
        onClose={() => setShowRoleConfirm(false)}
        onCancel={() => setShowRoleConfirm(false)}
      />

      {/* Confirmation: Revoke Access */}
      <ConfirmDialog
        isOpen={showRemoveConfirm}
        title={`Revoke Access for ${userToRemove?.name}?`}
        message={`The user will not be able to log in or access timesheets until reactivated by an administrator.`}
        variant="danger"
        confirmText="Revoke Access"
        cancelText="Keep Active"
        onConfirm={handleConfirmRemoveAccess}
        onClose={() => setShowRemoveConfirm(false)}
        onCancel={() => setShowRemoveConfirm(false)}
      />

      {/* Confirmation: Save Permissions */}
      <ConfirmDialog
        isOpen={showSaveMatrixConfirm}
        title="Apply System-Wide Permissions?"
        message="These permission changes will immediately affect access rights for all 248 accounts in Dayflow. This action cannot be undone without manually reverting each toggle."
        variant="primary"
        confirmText="Apply Permissions"
        cancelText="Review Changes"
        isLoading={isSavingMatrix}
        onConfirm={handleConfirmSaveMatrix}
        onClose={() => setShowSaveMatrixConfirm(false)}
        onCancel={() => setShowSaveMatrixConfirm(false)}
      />
    </div>
  );
};
