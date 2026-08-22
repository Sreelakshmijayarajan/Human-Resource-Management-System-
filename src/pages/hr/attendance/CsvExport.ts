import { AttendanceRecord } from '../../../types';

export const exportAttendanceToCSV = (records: AttendanceRecord[], filename: string = 'attendance_export.csv') => {
  if (records.length === 0) return;

  const headers = ['Employee ID', 'Name', 'Department', 'Date', 'Check In', 'Check Out', 'Total Hours', 'Status'];
  
  const csvContent = records.map(r => {
    return [
      r.employeeId,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.date,
      r.checkIn || '—',
      r.checkOut || '—',
      r.totalHours || '—',
      r.status
    ].join(',');
  });

  const finalCsv = [headers.join(','), ...csvContent].join('\n');
  const blob = new Blob([finalCsv], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
