import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calculator, AlertCircle } from 'lucide-react';
import { PayrollRecord, SalaryStructure, SalaryItem } from '../../types/payroll';

interface SalaryStructureModalProps {
  isOpen: boolean;
  record: PayrollRecord | null;
  onSave: (updatedRecord: PayrollRecord) => void;
  onClose: () => void;
}

export const SalaryStructureModal: React.FC<SalaryStructureModalProps> = ({
  isOpen,
  record,
  onSave,
  onClose,
}) => {
  const [basicPay, setBasicPay] = useState<number>(0);
  const [hra, setHra] = useState<number>(0);
  const [allowances, setAllowances] = useState<SalaryItem[]>([]);
  const [deductions, setDeductions] = useState<SalaryItem[]>([]);
  const [errors, setErrors] = useState<string>('');

  useEffect(() => {
    if (record && record.structure) {
      setBasicPay(record.structure.basicPay);
      setHra(record.structure.hra);
      setAllowances(record.structure.allowances || []);
      setDeductions(record.structure.deductions || []);
      setErrors('');
    }
  }, [record, isOpen]);

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

  // Live calculations
  const totalAllowances = allowances.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const grossSalary = (Number(basicPay) || 0) + (Number(hra) || 0) + totalAllowances;
  const totalDeductions = deductions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  // Handlers for dynamic allowance rows
  const handleAddAllowance = () => {
    setAllowances([
      ...allowances,
      { id: `al-${Date.now()}`, label: 'Other Allowance', amount: 1000 },
    ]);
  };

  const handleUpdateAllowance = (id: string, field: 'label' | 'amount', value: any) => {
    setAllowances(
      allowances.map((item) =>
        item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
      )
    );
  };

  const handleRemoveAllowance = (id: string) => {
    setAllowances(allowances.filter((item) => item.id !== id));
  };

  // Handlers for dynamic deduction rows
  const handleAddDeduction = () => {
    setDeductions([
      ...deductions,
      { id: `de-${Date.now()}`, label: 'Other Deduction', amount: 500 },
    ]);
  };

  const handleUpdateDeduction = (id: string, field: 'label' | 'amount', value: any) => {
    setDeductions(
      deductions.map((item) =>
        item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
      )
    );
  };

  const handleRemoveDeduction = (id: string) => {
    setDeductions(deductions.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (basicPay < 0 || hra < 0) {
      setErrors('Salary values cannot be negative numbers.');
      return;
    }

    const hasNegativeAllowance = allowances.some((a) => a.amount < 0);
    const hasNegativeDeduction = deductions.some((d) => d.amount < 0);

    if (hasNegativeAllowance || hasNegativeDeduction) {
      setErrors('Itemized allowances and deductions cannot be negative.');
      return;
    }

    const updatedStructure: SalaryStructure = {
      employeeId: record.employeeId,
      basicPay: Number(basicPay),
      hra: Number(hra),
      allowances,
      deductions,
      grossSalary,
      totalDeductions,
      netSalary,
    };

    const updatedRecord: PayrollRecord = {
      ...record,
      grossSalary,
      netSalary,
      structure: updatedStructure,
    };

    onSave(updatedRecord);
  };

  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#161E28] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/[0.06] bg-white dark:bg-[#161E28] sticky top-0 z-10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Edit Salary Structure</h3>
            <p className="text-xs text-slate-500 dark:text-[#707A87] mt-0.5">
              Employee: <span className="font-semibold text-slate-700 dark:text-[#E5E7EB]">{record.employeeName}</span> ({record.designation})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B2531] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6 overflow-y-auto flex-1">
          {errors && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errors}</span>
            </div>
          )}

          {/* Core Salary Section */}
          <div>
            <h4 className="text-xs font-bold text-[#0070c7] dark:text-[#36abf8] uppercase tracking-wider mb-3">
              1. Base Compensation
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] mb-1">
                  Basic Pay (₹ / month)
                </label>
                <input
                  type="number"
                  min="0"
                  value={basicPay}
                  onChange={(e) => {
                    setBasicPay(Math.max(0, Number(e.target.value)));
                    setErrors('');
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#0c8fe9]/20 focus:border-[#0c8fe9]/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] mb-1">
                  House Rent Allowance (HRA) (₹ / month)
                </label>
                <input
                  type="number"
                  min="0"
                  value={hra}
                  onChange={(e) => {
                    setHra(Math.max(0, Number(e.target.value)));
                    setErrors('');
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-[#0c8fe9]/20 focus:border-[#0c8fe9]/40 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Allowances Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider">
                2. Itemized Allowances
              </h4>
              <button
                type="button"
                onClick={handleAddAllowance}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Allowance
              </button>
            </div>

            <div className="space-y-2">
              {allowances.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateAllowance(item.id, 'label', e.target.value)}
                    placeholder="Allowance Title"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                  <div className="w-36 relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 dark:text-[#707A87]">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={item.amount}
                      onChange={(e) => handleUpdateAllowance(item.id, 'amount', e.target.value)}
                      className="w-full pl-6 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllowance(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {allowances.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-[#707A87] italic">No additional allowances added.</p>
              )}
            </div>
          </div>

          {/* Deductions Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-red-900 dark:text-red-400 uppercase tracking-wider">
                3. Itemized Deductions (PF, Tax, PT)
              </h4>
              <button
                type="button"
                onClick={handleAddDeduction}
                className="flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Deduction
              </button>
            </div>

            <div className="space-y-2">
              {deductions.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateDeduction(item.id, 'label', e.target.value)}
                    placeholder="Deduction Title"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  />
                  <div className="w-36 relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 dark:text-[#707A87]">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={item.amount}
                      onChange={(e) => handleUpdateDeduction(item.id, 'amount', e.target.value)}
                      className="w-full pl-6 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeduction(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {deductions.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-[#707A87] italic">No deductions added.</p>
              )}
            </div>
          </div>

          {/* Live Summary Footer Card */}
          <div className="p-4 bg-slate-900 dark:bg-[#121821] border border-transparent dark:border-white/[0.08] text-white rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-300 dark:text-[#A7B0BC]">
              <span>Gross Salary:</span>
              <span className="font-semibold text-emerald-400">{formatCurrency(grossSalary)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 dark:text-[#A7B0BC]">
              <span>Total Deductions:</span>
              <span className="font-semibold text-red-400">-{formatCurrency(totalDeductions)}</span>
            </div>
            <div className="pt-2 border-t border-slate-700 dark:border-white/[0.08] flex items-center justify-between text-sm font-extrabold">
              <span className="text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#36abf8]" /> Live Calculated Net Pay:
              </span>
              <span className="text-emerald-400 text-base">{formatCurrency(netSalary)} / month</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-[#E5E7EB] border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] rounded-xl hover:bg-slate-50 dark:hover:bg-[#1B2531] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0c8fe9] hover:bg-[#0070c7] rounded-xl shadow-xs transition-colors"
            >
              Save Salary Structure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
