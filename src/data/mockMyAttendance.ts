export interface MyAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null;
  checkOut: string | null;
  totalHours: string | null;
  status: 'present' | 'absent' | 'half_day' | 'on_leave' | 'holiday' | 'weekend' | 'late';
  notes?: string;
}

const generate30DaysAttendance = (): MyAttendanceRecord[] => {
  const records: MyAttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        totalHours: null,
        status: 'weekend',
        notes: 'Weekly Off',
      });
      continue;
    }

    // Special fixed mock cases for demo realism
    if (i === 1) { // Yesterday
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: '09:05 AM',
        checkOut: '06:12 PM',
        totalHours: '9h 07m',
        status: 'present',
        notes: 'Regular shift',
      });
    } else if (i === 3) {
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: '09:42 AM',
        checkOut: '06:30 PM',
        totalHours: '8h 48m',
        status: 'late',
        notes: 'Traffic delay acknowledged by HR',
      });
    } else if (i === 7) {
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: '09:00 AM',
        checkOut: '01:00 PM',
        totalHours: '4h 00m',
        status: 'half_day',
        notes: 'Approved doctor appointment',
      });
    } else if (i === 12) {
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        totalHours: null,
        status: 'on_leave',
        notes: 'Approved Casual Leave',
      });
    } else if (i === 18) {
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        totalHours: null,
        status: 'holiday',
        notes: 'Independence Day',
      });
    } else if (i === 22) {
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        totalHours: null,
        status: 'absent',
        notes: 'Unexcused absence',
      });
    } else if (i === 0) {
      // Today (will be synced with active check-in state)
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: '09:14 AM',
        checkOut: null,
        totalHours: null,
        status: 'present',
        notes: 'Today',
      });
    } else {
      // Default regular present day
      const inMin = 5 + (i % 12);
      const outMin = 10 + (i % 20);
      records.push({
        id: `att-${dateStr}`,
        date: dateStr,
        checkIn: `09:${inMin < 10 ? '0' + inMin : inMin} AM`,
        checkOut: `06:${outMin < 10 ? '0' + outMin : outMin} PM`,
        totalHours: `9h ${outMin + (15 - inMin)}m`,
        status: 'present',
        notes: 'Regular shift',
      });
    }
  }

  return records;
};

export const initialMyAttendance: MyAttendanceRecord[] = generate30DaysAttendance();
