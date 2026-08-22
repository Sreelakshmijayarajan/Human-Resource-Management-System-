import { UserRole } from './auth';

export interface UserRoleItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  initials: string;
  avatarColor: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

export type PermissionCategoryKey = 
  | 'employee_data'
  | 'attendance'
  | 'leave_approval'
  | 'payroll'
  | 'reports'
  | 'settings';

export interface PermissionRule {
  view: boolean;
  edit: boolean;
  delete: boolean;
  locked?: boolean; // When true, cannot be disabled (e.g. employee viewing own profile)
  lockedDescription?: string;
}

export interface CategoryPermissionConfig {
  key: PermissionCategoryKey;
  label: string;
  description: string;
  employee: PermissionRule;
  hr_admin: PermissionRule;
}
