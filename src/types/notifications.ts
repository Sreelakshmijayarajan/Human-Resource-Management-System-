export type NotificationCategory = 'alert' | 'announcement';

export type AlertType = 
  | 'leave_request' 
  | 'attendance_anomaly' 
  | 'document_expiring' 
  | 'payroll_due' 
  | 'system';

export type AudienceType = 'all' | 'department' | 'individuals';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  type: AlertType;
  title: string;
  message: string;
  time: string;
  timestamp: string;
  read: boolean;
  author?: {
    name: string;
    role: string;
    avatarColor?: string;
    initials?: string;
  };
  audience?: {
    type: AudienceType;
    targetName?: string;
  };
  actionUrl?: string;
  actionLabel?: string;
}

export interface AnnouncementFormData {
  title: string;
  message: string;
  audienceType: AudienceType;
  selectedDepartment: string;
  selectedEmployees: string[];
  scheduleType: 'now' | 'later';
  scheduledDateTime: string;
  priority: 'normal' | 'urgent';
}
