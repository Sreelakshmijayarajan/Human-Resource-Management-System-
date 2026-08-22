export interface ActivityItem {
  id: string;
  type: 'attendance' | 'leave' | 'payroll' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
}

export const mockActivityFeed: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'attendance',
    title: 'Clocked In',
    description: 'Checked in at 09:14 AM from Indiranagar HQ',
    timestamp: 'Today at 09:14 AM',
  },
  {
    id: 'act-2',
    type: 'leave',
    title: 'Leave Approved',
    description: 'Casual Leave request for Aug 28–29 approved by Sneha Rao',
    timestamp: 'Yesterday at 04:30 PM',
  },
  {
    id: 'act-3',
    type: 'payroll',
    title: 'Payslip Available',
    description: 'August 2026 salary statement has been generated',
    timestamp: '2 days ago',
  },
  {
    id: 'act-4',
    type: 'announcement',
    title: 'Company Announcement',
    description: 'All-Hands Product Roadmap presentation scheduled for Friday',
    timestamp: '3 days ago',
  },
  {
    id: 'act-5',
    type: 'attendance',
    title: 'Completed Shift',
    description: 'Clocked out at 06:12 PM • 9h 07m total worked',
    timestamp: 'Aug 21, 2026',
  },
];
