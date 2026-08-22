export interface SalaryItem {
  id: string;
  label: string;
  amount: number;
}

export interface SalaryStructure {
  employeeId: string;
  basicPay: number;
  hra: number;
  allowances: SalaryItem[];
  deductions: SalaryItem[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  avatarInitials: string;
  avatarColor: string;
  department: string;
  designation: string;
  grossSalary: number;
  netSalary: number;
  lastPayslipDate: string;
  status: 'paid' | 'pending';
  structure: SalaryStructure;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  bankAccount: string;
  pan: string;
  payPeriod: string;
  payDate: string;
  basicPay: number;
  hra: number;
  allowances: SalaryItem[];
  deductions: SalaryItem[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}
