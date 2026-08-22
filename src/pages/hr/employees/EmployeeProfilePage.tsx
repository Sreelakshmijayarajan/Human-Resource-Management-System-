import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Building2, Calendar as CalendarIcon } from 'lucide-react';
import { useHRData } from '../../../context/HRDataContext';
import { StatusBadge, BadgeStatus } from '../../../components/ui/StatusBadge';
import { DocumentsTab } from './DocumentsTab';
import { EmployeeFormPanel } from './EmployeeFormPanel';
import { Employee } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../components/ui/StatusBadge';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateEmployee } = useHRData();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'attendance'>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const employee = employees.find(e => e.id === id);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Employee Not Found</h2>
        <p className="text-slate-500 mb-6">The employee record you're looking for doesn't exist or was removed.</p>
        <button onClick={() => navigate('/hr/employees')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium">
          Back to Directory
        </button>
      </div>
    );
  }

  const handleSave = async (empData: Employee | Omit<Employee, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    updateEmployee(employee.id, empData);
    showToast('Employee profile updated', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/hr/employees')}
          className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 hover:shadow-sm transition-all text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center text-sm font-medium text-slate-500 mb-1 gap-2">
            <Link to="/hr/employees" className="hover:text-indigo-600 transition-colors">Directory</Link>
            <span>/</span>
            <span className="text-slate-900">{employee.name}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Profile</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-6 sm:px-10 pb-6 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-5">
              <div className={cn("w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white border-4 border-white shadow-md", employee.avatarColor)}>
                {employee.avatarInitials}
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2>
                <p className="text-sm font-medium text-slate-500">{employee.designation}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <StatusBadge status={employee.status as BadgeStatus} />
              <button 
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition-colors shadow-sm ml-auto sm:ml-0"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Building2 className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Department</p>
                <p className="text-sm font-semibold text-slate-900">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Mail className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-900">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Phone className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Phone</p>
                <p className="text-sm font-semibold text-slate-900">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><CalendarIcon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Joined On</p>
                <p className="text-sm font-semibold text-slate-900">{new Date(employee.dateOfJoining).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
          {(['overview', 'documents', 'attendance'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab 
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <section>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Job Information</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-4">
                  <div className="flex justify-between pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500 text-sm">Employee ID</span>
                    <span className="font-semibold text-slate-900 text-sm">{employee.id}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500 text-sm">Employment Type</span>
                    <span className="font-semibold text-slate-900 text-sm">{employee.employmentType}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500 text-sm">Reporting To</span>
                    <span className="font-semibold text-slate-900 text-sm">Not assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Work Location</span>
                    <span className="font-semibold text-slate-900 text-sm">Headquarters</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Personal Details</h3>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-4">
                  <div className="flex justify-between pb-3 border-b border-slate-200/60">
                    <span className="text-slate-500 text-sm">Gender</span>
                    <span className="font-semibold text-slate-900 text-sm">{employee.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm shrink-0">Address</span>
                    <span className="font-semibold text-slate-900 text-sm text-right">{employee.address || 'Not specified'}</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="animate-fade-in">
              <DocumentsTab employee={employee} />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="animate-fade-in text-center py-10">
              <h3 className="font-semibold text-slate-800 mb-2">Attendance Summary</h3>
              <p className="text-slate-500 text-sm mb-6">View full attendance details and correction history for this employee.</p>
              <Link to={`/hr/attendance/${employee.id}`} className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
                View Full Attendance Record
              </Link>
            </div>
          )}
        </div>
      </div>

      <EmployeeFormPanel
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        employee={employee}
        onSave={handleSave}
      />
    </div>
  );
};
