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
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/hr/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to HR Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Role & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage user roles, administrative permissions, and security matrices across the organization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">HR Admins</p>
            <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
              {users.filter((u) => u.role === 'hr_admin').length} Users
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Employees</p>
            <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {users.filter((u) => u.role === 'employee').length} Users
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/70 rounded-2xl w-fit">
        <button
          onClick={() => handleTabChange('users')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            currentTab === 'users'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-500" />
          <span>Users & Assigned Roles</span>
        </button>

        <button
          onClick={() => handleTabChange('permissions')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            currentTab === 'permissions'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span>Permissions Matrix</span>
          {hasMatrixChanges && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
        </button>
      </div>

      {/* TAB: USERS & ROLES */}
      {currentTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name, email, or department..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value as any); setCurrentPage(1); }}
                className="bg-transparent font-medium text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="hr_admin">HR / Admin Only</option>
                <option value="employee">Employees Only</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-4">Department & Title</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        No users match the search filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${user.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                              {user.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{user.department}</p>
                          <p className="text-[11px] text-slate-400">{user.jobTitle}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          {user.role === 'hr_admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200/80 dark:ring-indigo-800">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>HR / Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200/80 dark:ring-blue-800">
                              <Users className="w-3.5 h-3.5" />
                              <span>Employee</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <StatusBadge status={user.status} />
                            <p className="text-[11px] text-slate-400">{user.lastActive}</p>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openChangeRoleDialog(user)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                            >
                              Change Role
                            </button>

                            {user.status === 'active' ? (
                              <button
                                onClick={() => { setUserToRemove(user); setShowRemoveConfirm(true); }}
                                title="Revoke Access"
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-slate-800 dark:text-slate-200">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 p-4 sm:p-5 rounded-3xl border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Granular Role Privileges Matrix
              </h3>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300">
                Configure module-level access. Locked baseline rights ensure employees can always view their profile and timesheet.
              </p>
            </div>

            <button
              onClick={() => setShowSaveMatrixConfirm(true)}
              disabled={!hasMatrixChanges || isSavingMatrix}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
                hasMatrixChanges
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 active:scale-[0.98]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSavingMatrix ? 'Saving...' : 'Save Permissions'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-4 px-6 w-1/3">Module & Resource</th>
                    <th className="py-4 px-6 text-center border-l border-slate-100 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-950/20">
                      <div className="flex items-center justify-center gap-1.5 text-blue-700 dark:text-blue-300">
                        <Users className="w-3.5 h-3.5" />
                        <span>Employee Role</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center border-l border-slate-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-950/20">
                      <div className="flex items-center justify-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>HR / Admin Role</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {permissionsMatrix.map((cat) => (
                    <tr key={cat.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-5 px-6 space-y-1">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{cat.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">{cat.description}</p>
                        {cat.employee.locked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 pt-1">
                            <Lock className="w-3 h-3 text-amber-500" />
                            <span>{cat.employee.lockedDescription}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-5 px-6 border-l border-slate-100 dark:border-slate-800 bg-blue-50/10 dark:bg-blue-950/10">
                        <div className="flex items-center justify-center gap-4">
                          {(['view', 'edit', 'delete'] as const).map((action) => (
                            <label key={action} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={cat.employee[action]}
                                disabled={cat.employee.locked && action === 'view'}
                                onChange={() => togglePermission(cat.key, 'employee', action)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                              />
                              <span className="capitalize">{action === 'edit' ? 'Apply' : action}</span>
                            </label>
                          ))}
                        </div>
                      </td>

                      <td className="py-5 px-6 border-l border-slate-100 dark:border-slate-800 bg-indigo-50/10 dark:bg-indigo-950/10">
                        <div className="flex items-center justify-center gap-4">
                          {(['view', 'edit', 'delete'] as const).map((action) => (
                            <label key={action} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={cat.hr_admin[action]}
                                onChange={() => togglePermission(cat.key, 'hr_admin', action)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
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
