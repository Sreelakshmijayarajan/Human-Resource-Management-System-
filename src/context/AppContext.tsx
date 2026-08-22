import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserRole } from '../types/auth';
import { EmployeeData, AttendanceStatus } from '../types';
import { mockEmployeeData } from '../data/mockEmployee';
import { EmployeeProfile, ProfileDocument, initialEmployeeProfile } from '../data/mockEmployeeProfile';
import { MyAttendanceRecord, initialMyAttendance } from '../data/mockMyAttendance';
import { ActivityItem, mockActivityFeed } from '../data/mockActivityFeed';

import { extractFirstNameFromEmail } from '../utils/nameUtils';

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
  profile: EmployeeProfile;
  attendanceHistory: MyAttendanceRecord[];
  activityFeed: ActivityItem[];
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  updateAttendance: (status: AttendanceStatus, time?: string) => void;
  updateProfileDetails: (updates: Partial<EmployeeProfile>) => void;
  addProfileDocument: (doc: Omit<ProfileDocument, 'id' | 'uploadedAt' | 'category'>) => void;
  deleteProfileDocument: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('dayflow_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          const firstName = extractFirstNameFromEmail(parsed.email);
          return {
            ...parsed,
            firstName,
            name: firstName,
            avatarInitials: firstName.slice(0, 2).toUpperCase(),
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [employeeData, setEmployeeData] = useState<EmployeeData>(() => {
    const defaultName = user ? user.firstName : mockEmployeeData.name;
    return {
      ...mockEmployeeData,
      name: defaultName,
      firstName: defaultName,
      email: user ? user.email : mockEmployeeData.email,
    };
  });

  const [profile, setProfile] = useState<EmployeeProfile>(() => {
    const defaultName = user ? user.firstName : initialEmployeeProfile.name;
    return {
      ...initialEmployeeProfile,
      name: defaultName,
      firstName: defaultName,
      email: user ? user.email : initialEmployeeProfile.email,
    };
  });

  const [attendanceHistory, setAttendanceHistory] = useState<MyAttendanceRecord[]>(initialMyAttendance);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(mockActivityFeed);

  const login = useCallback((email: string, role: UserRole) => {
    const firstName = extractFirstNameFromEmail(email);
    const initials = firstName.slice(0, 2).toUpperCase();

    const newUser: AuthUser = {
      email,
      firstName,
      name: firstName,
      role,
      avatarInitials: initials,
    };

    setUser(newUser);
    try {
      localStorage.setItem('dayflow_auth_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }

    setEmployeeData((prev) => ({
      ...prev,
      name: firstName,
      firstName: firstName,
      email: email,
      avatarInitials: initials,
    }));

    setProfile((prev) => ({
      ...prev,
      name: firstName,
      firstName: firstName,
      email: email,
    }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('dayflow_auth_user');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateAttendance = useCallback((status: AttendanceStatus, time?: string) => {
    const nowTime = time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    setEmployeeData((prev) => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        status,
        checkInTime: status === 'checked_in' ? nowTime : prev.attendance.checkInTime,
        checkOutTime: status === 'checked_out' ? nowTime : prev.attendance.checkOutTime,
      },
    }));

    // Sync with today's record in attendanceHistory
    const todayStr = new Date().toISOString().split('T')[0];
    setAttendanceHistory((prev) => {
      const exists = prev.find((r) => r.date === todayStr);
      if (exists) {
        return prev.map((r) => {
          if (r.date === todayStr) {
            return {
              ...r,
              status: status === 'checked_in' || status === 'checked_out' ? 'present' : 'absent',
              checkIn: status === 'checked_in' ? nowTime : r.checkIn,
              checkOut: status === 'checked_out' ? nowTime : r.checkOut,
              totalHours: status === 'checked_out' ? '8h 45m' : r.totalHours,
            };
          }
          return r;
        });
      } else {
        return [
          {
            id: `att-${todayStr}`,
            date: todayStr,
            checkIn: status === 'checked_in' ? nowTime : null,
            checkOut: status === 'checked_out' ? nowTime : null,
            totalHours: null,
            status: 'present',
            notes: 'Today',
          },
          ...prev,
        ];
      }
    });

    // Add activity feed item
    const actionText = status === 'checked_in' ? 'Clocked In' : 'Clocked Out';
    const actionDesc = status === 'checked_in' ? `Checked in at ${nowTime}` : `Checked out at ${nowTime}`;
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'attendance',
      title: actionText,
      description: actionDesc,
      timestamp: 'Just now',
    };
    setActivityFeed((prev) => [newActivity, ...prev.slice(0, 4)]);
  }, []);

  const updateProfileDetails = useCallback((updates: Partial<EmployeeProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const addProfileDocument = useCallback((doc: Omit<ProfileDocument, 'id' | 'uploadedAt' | 'category'>) => {
    const newDoc: ProfileDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'self_uploaded',
    };
    setProfile((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
    }));
  }, []);

  const deleteProfileDocument = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
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
        profile,
        attendanceHistory,
        activityFeed,
        isAuthenticated: !!user,
        login,
        logout,
        updateAttendance,
        updateProfileDetails,
        addProfileDocument,
        deleteProfileDocument,
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
