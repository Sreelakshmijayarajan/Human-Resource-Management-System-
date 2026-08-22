import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, AttendanceRecord, CorrectionEntry } from '../types';
import { mockEmployeesData } from '../data/mockEmployees';
import { mockAttendanceData } from '../data/mockAttendance';

interface HRDataContextType {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  
  // Employee mutations
  addEmployee: (emp: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Attendance mutations
  correctAttendance: (recordId: string, correction: Omit<CorrectionEntry, 'id' | 'correctedAt' | 'correctedBy'>, adminName: string) => void;
}

const HRDataContext = createContext<HRDataContextType | undefined>(undefined);

export const HRDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployeesData);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceData);

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `EMP-${(employees.length + 1).toString().padStart(3, '0')}`;
    const newEmp: Employee = { ...empData, id: newId };
    setEmployees([newEmp, ...employees]);
    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
    
    // If name/department changes, we might want to update attendance records for consistency in our mock setup
    if (updates.name || updates.department) {
      setAttendanceRecords(records => records.map(rec => {
        if (rec.employeeId === id) {
          return {
            ...rec,
            employeeName: updates.name || rec.employeeName,
            department: updates.department || rec.department
          };
        }
        return rec;
      }));
    }
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    // Optionally delete their attendance records as well, but usually HR keeps them
  };

  const correctAttendance = (recordId: string, correction: Omit<CorrectionEntry, 'id' | 'correctedAt' | 'correctedBy'>, adminName: string) => {
    setAttendanceRecords(records => records.map(rec => {
      if (rec.id === recordId) {
        const newEntry: CorrectionEntry = {
          id: `corr-${Date.now()}`,
          correctedBy: adminName,
          correctedAt: new Date().toISOString(),
          ...correction,
        };
        
        let totalHours = rec.totalHours;
        if (correction.newStatus === 'present' || correction.newStatus === 'half_day' || correction.newStatus === 'late') {
            // simple mock hours calculation
            totalHours = '8h 00m';
        } else {
            totalHours = null;
        }

        return {
          ...rec,
          status: correction.newStatus as any,
          correctionHistory: [newEntry, ...rec.correctionHistory],
          totalHours: totalHours
        };
      }
      return rec;
    }));
  };

  return (
    <HRDataContext.Provider value={{
      employees,
      attendanceRecords,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      correctAttendance
    }}>
      {children}
    </HRDataContext.Provider>
  );
};

export const useHRData = () => {
  const context = useContext(HRDataContext);
  if (context === undefined) {
    throw new Error('useHRData must be used within an HRDataProvider');
  }
  return context;
};
