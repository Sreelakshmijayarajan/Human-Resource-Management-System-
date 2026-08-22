import { AttendanceRecord } from '../types';
import { mockEmployeesData } from './mockEmployees';

const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Generate 30 days of records ending on today
  for (let i = 29; i >= 0; i--) {
    const date = new Date(year, month, today.getDate() - i);
    // Format YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    mockEmployeesData.forEach((emp) => {
      let status: AttendanceRecord['status'] = 'present';
      let checkIn = '09:00 AM';
      let checkOut = '06:00 PM';
      let totalHours: string | null = '9h 00m';

      if (isWeekend) {
        status = 'holiday';
        checkIn = null as any;
        checkOut = null as any;
        totalHours = null;
      } else {
        // Randomize attendance
        const rand = Math.random();
        if (emp.status === 'on_leave') {
          status = 'on_leave';
          checkIn = null as any;
          checkOut = null as any;
          totalHours = null;
        } else if (rand > 0.95) {
          status = 'absent';
          checkIn = null as any;
          checkOut = null as any;
          totalHours = null;
        } else if (rand > 0.85) {
          status = 'half_day';
          checkIn = '09:00 AM';
          checkOut = '01:00 PM';
          totalHours = '4h 00m';
        } else if (rand > 0.75) {
          status = 'late';
          checkIn = '10:15 AM';
          checkOut = '06:00 PM';
          totalHours = '7h 45m';
        } else {
          // slight variation in times
          const inMin = Math.floor(Math.random() * 15);
          const outMin = Math.floor(Math.random() * 30);
          checkIn = `08:${60 - inMin} AM`.replace('08:60', '09:00');
          checkOut = `06:${outMin < 10 ? '0' + outMin : outMin} PM`;
          totalHours = `9h ${outMin + inMin}m`;
        }
      }

      records.push({
        id: `att-${dateStr}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeInitials: emp.avatarInitials,
        avatarColor: emp.avatarColor,
        department: emp.department,
        date: dateStr,
        checkIn: checkIn as string | null,
        checkOut: checkOut as string | null,
        totalHours,
        status,
        correctionHistory: [],
      });
    });
  }
  return records.reverse(); // newest first
};

export const mockAttendanceData = generateMockAttendance();
