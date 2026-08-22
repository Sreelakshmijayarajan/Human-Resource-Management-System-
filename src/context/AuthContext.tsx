import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types/auth';

interface AuthState {
  role: UserRole;
  email: string;
}

interface AuthContextProps extends AuthState {
  setAuth: (state: AuthState) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ role: 'employee', email: '' });
  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
