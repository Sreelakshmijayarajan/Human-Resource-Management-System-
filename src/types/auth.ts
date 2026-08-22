export type UserRole = 'employee' | 'hr_admin';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
  role: UserRole;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MockUser {
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}
