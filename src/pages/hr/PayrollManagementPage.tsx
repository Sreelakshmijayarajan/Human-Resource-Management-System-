import React from 'react';
import { Download, WalletCards, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

interface PayrollEntry {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'processed' | 'pending' | 'on_hold';
}

const payrollData: PayrollEntry[] = [
  { id: 'E001', name: 'Sanjay Kumar', initials: 'SK', avatarColor: 'bg-blue-500', department: 'Product & Design', basicSalary: 85000, allowances: 15000, deductions: 12000, netPay: 88000, status: 'processed' },
  { id: 'E002', name: 'Priya Sharma', initials: 'PS', avatarColor: 'bg-purple-500', department: 'Engineering', basicSalary: 92000, allowances: 18000, deductions: 14500, netPay: 95500, status: 'processed' },
  { id: 'E003', name: 'Rahul Verma', initials: 'RV', avatarColor: 'bg-emerald-500', department: 'Human Resources', basicSalary: 70000, allowances: 10000, deductions: 10000, netPay: 70000, status: 'on_hold' },
  { id: 'E004', name: 'Ananya Iyer', initials: 'AI', avatarColor: 'bg-pink-500', department: 'Analytics', basicSalary: 78000, allowances: 12000, deductions: 11000, netPay: 79000, status: 'processed' },
  { id: 'E005', name: 'Dev Patel', initials: 'DP', avatarColor: 'bg-amber-500', department: 'Engineering', basicSalary: 88000, allowances: 16000, deductions: 13000, netPay: 91000, status: 'pending' },
  { id: 'E006', name: 'Meera Nair', initials: 'MN', avatarColor: 'bg-cyan-500', department: 'Product & Design', basicSalary: 72000, allowances: 11000, deductions: 10500, netPay: 72500, status: 'processed' },
  { id: 'E007', name: 'Arjun Singh', initials: 'AS', avatarColor: 'bg-indigo-500', department: 'Engineering', basicSalary: 95000, allowances: 20000, deductions: 15000, netPay: 100000, status: 'processed' },
  { id: 'E008', name: 'Kavitha Reddy', initials: 'KR', avatarColor: 'bg-rose-500', department: 'Finance', basicSalary: 110000, allowances: 25000, deductions: 18000, netPay: 117000, status: 'pending' },
];

const statusCfg = {
  processed: { label: 'Processed', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  on_hold: { label: 'On Hold', className: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
};

const fmt = (n: number) => '\u20b9' + n.toLocaleString('en-IN');

export const PayrollManagementPage: React.FC = () => {
  const month = 'August 2026';
  const totalNet = payrollData.reduce((s, e) => s + e.netPay, 0);
  const processed = payrollData.filter(e => e.status === 'processed').length;

  const summaryCards = [
    { label: 'Total Disbursement', value: fmt(totalNet), icon: WalletCards, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Avg Net Pay', value: fmt(Math.round(totalNet / payrollData.length)), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Employees', value: String(payrollData.length), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Processed', value: processed + '/' + payrollData.length, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payroll Management</h1>
          <p className="text-sm text-slate-500 mt-1">{'Salary structures, payslips and disbursement for ' + month}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export Payroll
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={'w-10 h-10 rounded-xl ' + s.bg + ' ' + s.color + ' flex items-center justify-center flex-shrink-0'}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">{s.label}</p>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{'Payroll Register — ' + month}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Basic</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Allowances</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Deductions</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Net Pay</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payrollData.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={'w-9 h-9 rounded-xl ' + emp.avatarColor + ' text-white text-xs font-bold flex items-center justify-center'}>
                        {emp.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right hidden sm:table-cell text-slate-600">{fmt(emp.basicSalary)}</td>
                  <td className="px-5 py-4 text-right hidden md:table-cell text-emerald-600">+{fmt(emp.allowances)}</td>
                  <td className="px-5 py-4 text-right hidden md:table-cell text-red-500">-{fmt(emp.deductions)}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">{fmt(emp.netPay)}</td>
                  <td className="px-5 py-4">
                    <span className={'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ' + statusCfg[emp.status].className}>
                      {statusCfg[emp.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="px-5 py-4 font-bold text-slate-700" colSpan={4}>Total Payroll</td>
                <td className="px-5 py-4 text-right font-extrabold text-indigo-700 text-base">{fmt(totalNet)}</td>
                <td className="px-5 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
