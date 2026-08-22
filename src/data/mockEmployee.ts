import { EmployeeData, Notification } from '../types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Leave Approved',
    message: 'Your leave request for Aug 25–26 has been approved.',
    time: '2 hours ago',
    read: false,
    type: 'leave',
  },
  {
    id: '2',
    title: 'August Payslip Ready',
    message: 'Your payslip for August 2026 is now available.',
    time: 'Yesterday',
    read: false,
    type: 'payroll',
  },
  {
    id: '3',
    title: 'Team Announcement',
    message: 'All-hands meeting on Friday at 3:00 PM. Please confirm attendance.',
    time: '2 days ago',
    read: false,
    type: 'announcement',
  },
  {
    id: '4',
    title: 'Attendance Reminder',
    message: "Don't forget to check out before leaving today.",
    time: '3 days ago',
    read: true,
    type: 'attendance',
  },
];

export const mockEmployeeData: EmployeeData = {
  id: 'emp-001',
  name: 'Sanjay Kumar',
  firstName: 'Sanjay',
  role: 'Senior Product Designer',
  department: 'Product & Design',
  email: 'sanjay.kumar@dayflow.io',
  avatarInitials: 'SK',
  attendance: {
    status: 'not_checked_in',
    checkInTime: null,
    checkOutTime: null,
  },
  leaveBalance: {
    total: 18,
    used: 6,
    remaining: 12,
  },
  pendingLeaveRequests: 2,
  latestPayslip: {
    month: 'August',
    year: 2026,
    available: true,
  },
  notifications: {
    unread: 3,
    items: mockNotifications,
  },
};
