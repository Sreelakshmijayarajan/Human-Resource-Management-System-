import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LeavePolicy, LeaveType } from '../../types/leave';

interface LeavePolicyModalProps {
  isOpen: boolean;
  policy: LeavePolicy | null; // Null means adding new
  onSave: (policy: LeavePolicy) => void;
  onClose: () => void;
}

export const LeavePolicyModal: React.FC<LeavePolicyModalProps> = ({
  isOpen,
  policy,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<LeavePolicy>>({
    name: '',
    type: 'sick',
    annualQuota: 12,
    carryForwardAllowed: true,
    maxCarryForwardDays: 5,
    accrualMethod: 'monthly',
    applicableEmploymentTypes: ['Full-Time'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (policy) {
      setFormData(policy);
    } else {
      setFormData({
        name: '',
        type: 'sick',
        annualQuota: 12,
        carryForwardAllowed: true,
        maxCarryForwardDays: 5,
        accrualMethod: 'monthly',
        applicableEmploymentTypes: ['Full-Time'],
      });
    }
    setErrors({});
  }, [policy, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = 'Policy name is required';
    if (!formData.annualQuota || formData.annualQuota <= 0) errs.annualQuota = 'Quota must be a positive number';
    if (formData.carryForwardAllowed && (formData.maxCarryForwardDays === undefined || formData.maxCarryForwardDays < 0)) {
      errs.maxCarryForwardDays = 'Max carry forward days cannot be negative';
    }
    if (!formData.applicableEmploymentTypes || formData.applicableEmploymentTypes.length === 0) {
      errs.employment = 'Select at least one applicable employment type';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const savedPolicy: LeavePolicy = {
      id: policy ? policy.id : `pol-${Date.now()}`,
      name: formData.name || 'Custom Leave',
      type: (formData.type as LeaveType) || 'casual',
      annualQuota: Number(formData.annualQuota),
      carryForwardAllowed: Boolean(formData.carryForwardAllowed),
      maxCarryForwardDays: formData.carryForwardAllowed ? Number(formData.maxCarryForwardDays || 0) : 0,
      accrualMethod: formData.accrualMethod as 'monthly' | 'yearly',
      applicableEmploymentTypes: formData.applicableEmploymentTypes || ['Full-Time'],
    };

    onSave(savedPolicy);
  };

  const handleEmploymentTypeToggle = (type: string) => {
    const current = formData.applicableEmploymentTypes || [];
    if (current.includes(type)) {
      setFormData({ ...formData, applicableEmploymentTypes: current.filter((t) => t !== type) });
    } else {
      setFormData({ ...formData, applicableEmploymentTypes: [...current, type] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {policy ? 'Edit Leave Policy' : 'Add New Leave Policy'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Policy / Leave Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sabbatical Leave, Sick Leave"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Type Category</label>
              <select
                value={formData.type || 'sick'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveType })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
                <option value="unpaid">Unpaid Leave</option>
                <option value="maternity_paternity">Maternity/Paternity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Quota (Days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.annualQuota || ''}
                onChange={(e) => setFormData({ ...formData, annualQuota: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              {errors.annualQuota && <p className="text-xs text-red-600 mt-1">{errors.annualQuota}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Accrual Method</label>
              <select
                value={formData.accrualMethod || 'monthly'}
                onChange={(e) => setFormData({ ...formData, accrualMethod: e.target.value as 'monthly' | 'yearly' })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="monthly">Monthly Accrual</option>
                <option value="yearly">Yearly (Lump Sum)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Carry-Forward</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="carryForward"
                  checked={formData.carryForwardAllowed || false}
                  onChange={(e) => setFormData({ ...formData, carryForwardAllowed: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="carryForward" className="text-xs font-medium text-slate-700">
                  Allow carry-forward
                </label>
              </div>
            </div>
          </div>

          {formData.carryForwardAllowed && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Carry-Forward Days</label>
              <input
                type="number"
                min="0"
                value={formData.maxCarryForwardDays || 0}
                onChange={(e) => setFormData({ ...formData, maxCarryForwardDays: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              {errors.maxCarryForwardDays && <p className="text-xs text-red-600 mt-1">{errors.maxCarryForwardDays}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Applicable Employment Types</label>
            <div className="flex flex-wrap gap-2">
              {['Full-Time', 'Part-Time', 'Contract', 'Intern'].map((type) => {
                const isSelected = (formData.applicableEmploymentTypes || []).includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleEmploymentTypeToggle(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            {errors.employment && <p className="text-xs text-red-600 mt-1">{errors.employment}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Save Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
