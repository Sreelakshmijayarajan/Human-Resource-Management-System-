export interface DepartmentItem {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  headName: string;
  headEmail: string;
  headAvatarColor: string;
  headInitials: string;
  createdAt: string;
}

export interface CompanyProfile {
  companyName: string;
  taxId: string;
  domain: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  logoUrl?: string;
  workStartTime: string;
  workEndTime: string;
  weeklyOffDays: string[];
  timezone: string;
  currency: string;
}

export interface LeavePolicyItem {
  id: string;
  name: string;
  days: number;
  description: string;
  carryForwardMax: number;
  requiresApproval: boolean;
  paid: boolean;
  iconColor: string;
}
