export interface SalaryBreakdownItem {
  label: string;
  amount: number;
}

export interface MyPayslip {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  netSalary: number;
  totalDeductions: number;
  status: 'Paid';
  date: string;
  basicPay: number;
  hra: number;
  allowances: SalaryBreakdownItem[];
  deductions: SalaryBreakdownItem[];
}

export interface MySalarySummary {
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  payPeriod: string;
  bankAccount: string;
  paymentMethod: string;
}
