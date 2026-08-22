import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, WalletCards, Download } from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const navigate = useNavigate();

  const payslips = [
    { month: 'August 2026', gross: '$8,500.00', net: '$6,820.00', status: 'Paid', date: 'Aug 31, 2026' },
    { month: 'July 2026', gross: '$8,500.00', net: '$6,820.00', status: 'Paid', date: 'Jul 31, 2026' },
    { month: 'June 2026', gross: '$8,500.00', net: '$6,820.00', status: 'Paid', date: 'Jun 30, 2026' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Payroll & Payslips</h1>
          <p className="text-xs text-slate-500">Access confidential monthly salary statements and tax slips.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 shadow-card flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Latest Net Salary</p>
          <p className="text-3xl font-extrabold mt-1">$6,820.00 USD</p>
          <p className="text-xs text-emerald-100 mt-1">Disbursed via Direct Deposit on Aug 31, 2026</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
          <WalletCards className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Payslip Archive</h3>
        <div className="divide-y divide-slate-100">
          {payslips.map((slip, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{slip.month}</p>
                <p className="text-slate-500">Gross: {slip.gross} • Net: {slip.net}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {slip.status}
                </span>
                <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
