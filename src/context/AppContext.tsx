import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserRole } from '../types/auth';
import { EmployeeData, AttendanceStatus } from '../types';
import { mockEmployeeData } from '../data/mockEmployee';

interface AuthUser {
  name: string;
  firstName: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

interface AppContextValue {
  user: AuthUser | null;
  employeeData: EmployeeData;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  updateAttendance: (status: AttendanceStatus, time?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData>(mockEmployeeData);

  const login = useCallback((email: string, role: UserRole, name?: string) => {
    const displayName = name || mockEmployeeData.name;
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    setUser({
      name: displayName,
      firstName: displayName.split(' ')[0],
      email,
      role,
      avatarInitials: initials,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateAttendance = useCallback((status: AttendanceStatus, time?: string) => {
    setEmployeeData((prev) => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        status,
        checkInTime: status === 'checked_in' ? time || prev.attendance.checkInTime : prev.attendance.checkInTime,
        checkOutTime: status === 'checked_out' ? time || null : prev.attendance.checkOutTime,
      },
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setEmployeeData((prev) => {
      const updatedItems = prev.notifications.items.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unread = updatedItems.filter((n) => !n.read).length;
      return {
        ...prev,
        notifications: { items: updatedItems, unread },
      };
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setEmployeeData((prev) => ({
      ...prev,
      notifications: {
        items: prev.notifications.items.map((n) => ({ ...n, read: true })),
        unread: 0,
      },
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        employeeData,
        isAuthenticated: !!user,
        login,
        logout,
        updateAttendance,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
