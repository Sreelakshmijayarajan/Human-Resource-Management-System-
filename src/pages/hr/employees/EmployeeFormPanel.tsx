import React, { useState, useEffect } from 'react';
import { Employee } from '../../../types';
import { X, Save, User, Briefcase } from 'lucide-react';
import { cn } from '../../../components/ui/StatusBadge';

interface EmployeeFormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSave: (employeeData: Omit<Employee, 'id'> | Employee) => Promise<void>;
}

export const EmployeeFormPanel: React.FC<EmployeeFormPanelProps> = ({ isOpen, onClose, employee, onSave }) => {
  const isEditing = !!employee;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    employmentType: 'Full-time',
    status: 'active' as Employee['status'],
    dateOfJoining: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (employee) {
        setFormData({
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          designation: employee.designation,
          employmentType: employee.employmentType,
          status: employee.status,
          dateOfJoining: employee.dateOfJoining,
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: 'Engineering',
          designation: '',
          employmentType: 'Full-time',
          status: 'active',
          dateOfJoining: new Date().toISOString().split('T')[0],
        });
      }
      setErrors({});
    }
  }, [isOpen, employee]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'EMP';
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500', 'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-rose-500'];
      const avatarColor = employee?.avatarColor || colors[Math.floor(Math.random() * colors.length)];

      const employeeData = {
        ...formData,
        avatarInitials: initials,
        avatarColor,
        documents: employee?.documents || [],
      };

      await onSave(employee ? { ...employeeData, id: employee.id } as Employee : employeeData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className={cn(
        "fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Personal Info Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <User className="w-5 h-5" />
              <h3 className="font-semibold">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2",
                    errors.name ? "border-red-300 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                  )}
                  placeholder="e.g. Jane Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2",
                      errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                    )}
                    placeholder="name@dayflow.io"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2",
                      errors.phone ? "border-red-300 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                    )}
                    placeholder="+1 234 567 890"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Job Info Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Briefcase className="w-5 h-5" />
              <h3 className="font-semibold">Job Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2",
                    errors.designation ? "border-red-300 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                  )}
                  placeholder="e.g. Senior Frontend Engineer"
                />
                {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-indigo-400 focus:ring-indigo-100 bg-white"
                  >
                    <option>Engineering</option>
                    <option>Product & Design</option>
                    <option>Human Resources</option>
                    <option>Finance</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Analytics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-indigo-400 focus:ring-indigo-100 bg-white"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Intern</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-indigo-400 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-indigo-400 focus:ring-indigo-100 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </div>
    </>
  );
};
