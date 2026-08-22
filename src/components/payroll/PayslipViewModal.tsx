import React, { useRef, useEffect } from 'react';
import { X, Download, Printer, CheckCircle2 } from 'lucide-react';
import { PayrollRecord } from '../../types/payroll';

interface PayslipViewModalProps {
  isOpen: boolean;
  record: PayrollRecord | null;
  month?: string;
  onClose: () => void;
}

export const PayslipViewModal: React.FC<PayslipViewModalProps> = ({
  isOpen,
  record,
  month = 'August 2026',
  onClose,
}) => {
  const payslipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Generate downloadable formatted text/HTML PDF payload
    const payslipText = `
====================================================================
                        DAYFLOW HRMS PAYSLIP
====================================================================
Pay Period: ${month}
Employee Name: ${record.employeeName}
Employee ID: ${record.employeeId}
Department: ${record.department}
Designation: ${record.designation}
Status: ${record.status.toUpperCase()}
--------------------------------------------------------------------
EARNINGS
--------------------------------------------------------------------
Basic Pay:                  ${formatCurrency(record.structure.basicPay)}
House Rent Allowance (HRA): ${formatCurrency(record.structure.hra)}
${record.structure.allowances.map((a) => `${a.label.padEnd(27, ' ')}: ${formatCurrency(a.amount)}`).join('\n')}
--------------------------------------------------------------------
GROSS SALARY:               ${formatCurrency(record.grossSalary)}
====================================================================
DEDUCTIONS
--------------------------------------------------------------------
${record.structure.deductions.map((d) => `${d.label.padEnd(27, ' ')}: ${formatCurrency(d.amount)}`).join('\n')}
--------------------------------------------------------------------
TOTAL DEDUCTIONS:           ${formatCurrency(record.structure.totalDeductions)}
====================================================================
NET SALARY PAYABLE:         ${formatCurrency(record.netSalary)}
====================================================================
Generated automatically by Dayflow HRMS on ${new Date().toLocaleDateString()}
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([payslipText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Payslip_${record.employeeName.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Control Bar (hidden when printing) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Salary Slip Preview</span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-md">
              {month}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" /> Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" /> Download Statement
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formatted Printable Payslip Document */}
        <div ref={payslipRef} className="p-8 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                D
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Dayflow HRMS Inc.</h2>
                <p className="text-xs text-slate-500">100 Innovation Parkway, Suite 400, Tech City</p>
                <p className="text-xs text-slate-500">Tax Registration ID: DAYFLOW-IND-2026-X</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-extrabold rounded-lg uppercase tracking-wider mb-1">
                Payslip Voucher
              </span>
              <p className="text-xs text-slate-500">Pay Cycle: <span className="font-bold text-slate-800">{month}</span></p>
              <p className="text-xs text-slate-500">Generated: {record.lastPayslipDate}</p>
            </div>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Employee Name</span>
              <span className="font-bold text-slate-900 text-sm">{record.employeeName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Employee ID</span>
              <span className="font-semibold text-slate-800">{record.employeeId.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Department</span>
              <span className="font-semibold text-slate-800">{record.department}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Designation</span>
              <span className="font-semibold text-slate-800">{record.designation}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Bank Account</span>
              <span className="font-semibold text-slate-800">HDFC Bank ****4892</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">PAN Number</span>
              <span className="font-semibold text-slate-800">ABCDE1234F</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Days Worked</span>
              <span className="font-semibold text-slate-800">22 Days</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-0.5">Payment Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID
              </span>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
                <span>EARNINGS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-slate-600">Basic Pay</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(record.structure.basicPay)}</span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(record.structure.hra)}</span>
                </div>
                {record.structure.allowances.map((item) => (
                  <div key={item.id} className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50/70 px-4 py-2.5 border-t border-emerald-100 flex justify-between items-center text-xs font-bold text-emerald-950">
                <span>Total Gross Earnings</span>
                <span className="text-sm font-extrabold text-emerald-700">{formatCurrency(record.grossSalary)}</span>
              </div>
            </div>

            {/* Deductions Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
                <span>DEDUCTIONS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {record.structure.deductions.map((item) => (
                  <div key={item.id} className="px-4 py-2 flex justify-between">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-red-50/70 px-4 py-2.5 border-t border-red-100 flex justify-between items-center text-xs font-bold text-red-950">
                <span>Total Deductions</span>
                <span className="text-sm font-extrabold text-red-700">-{formatCurrency(record.structure.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Highlighted Net Salary Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block">Net Salary Payable</span>
              <p className="text-xs text-slate-400">Total Net Amount Transferred to Salary Account</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400">{formatCurrency(record.netSalary)}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">INR (Indian Rupees)</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            This is a computer-generated payslip document and does not require a physical signature.
          </div>
        </div>
      </div>
    </div>
  );
};
