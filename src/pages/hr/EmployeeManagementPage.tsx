import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Mail, Phone, Building2, Filter } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  initials: string;
  avatarColor: string;
}

const mockEmployees: Employee[] = [
  { id: 'E001', name: 'Sanjay Kumar', role: 'Senior Product Designer', department: 'Product & Design', email: 'sanjay.kumar@dayflow.io', phone: '+91 98765 43210', status: 'active', joinDate: '15 Mar 2022', initials: 'SK', avatarColor: 'bg-blue-500' },
  { id: 'E002', name: 'Priya Sharma', role: 'Frontend Engineer', department: 'Engineering', email: 'priya.sharma@dayflow.io', phone: '+91 91234 56789', status: 'active', joinDate: '02 Jun 2021', initials: 'PS', avatarColor: 'bg-purple-500' },
  { id: 'E003', name: 'Rahul Verma', role: 'HR Business Partner', department: 'Human Resources', email: 'rahul.verma@dayflow.io', phone: '+91 87654 32109', status: 'on_leave', joinDate: '19 Jan 2023', initials: 'RV', avatarColor: 'bg-emerald-500' },
  { id: 'E004', name: 'Ananya Iyer', role: 'Data Analyst', department: 'Analytics', email: 'ananya.iyer@dayflow.io', phone: '+91 99887 76655', status: 'active', joinDate: '08 Sep 2020', initials: 'AI', avatarColor: 'bg-pink-500' },
  { id: 'E005', name: 'Dev Patel', role: 'Backend Engineer', department: 'Engineering', email: 'dev.patel@dayflow.io', phone: '+91 77665 54433', status: 'inactive', joinDate: '23 Nov 2022', initials: 'DP', avatarColor: 'bg-amber-500' },
  { id: 'E006', name: 'Meera Nair', role: 'UX Researcher', department: 'Product & Design', email: 'meera.nair@dayflow.io', phone: '+91 88776 65544', status: 'active', joinDate: '11 Apr 2023', initials: 'MN', avatarColor: 'bg-cyan-500' },
  { id: 'E007', name: 'Arjun Singh', role: 'DevOps Engineer', department: 'Engineering', email: 'arjun.singh@dayflow.io', phone: '+91 96543 21098', status: 'active', joinDate: '30 Jul 2021', initials: 'AS', avatarColor: 'bg-indigo-500' },
  { id: 'E008', name: 'Kavitha Reddy', role: 'Finance Manager', department: 'Finance', email: 'kavitha.reddy@dayflow.io', phone: '+91 93210 98765', status: 'active', joinDate: '14 Feb 2020', initials: 'KR', avatarColor: 'bg-rose-500' },
];

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
  on_leave: { label: 'On Leave', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
};

export const EmployeeManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const departments = ['All', ...Array.from(new Set(mockEmployees.map(e => e.department)))];

  const filtered = mockEmployees.filter(e => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'All' || e.department === filterDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage profiles, documents and job records</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white text-slate-700"
          >
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Employees', value: mockEmployees.length, color: 'text-slate-900' },
          { label: 'Active', value: mockEmployees.filter(e => e.status === 'active').length, color: 'text-emerald-600' },
          { label: 'On Leave', value: mockEmployees.filter(e => e.status === 'on_leave').length, color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={'text-2xl font-extrabold ' + stat.color}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Department</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Contact</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={'w-9 h-9 rounded-xl ' + emp.avatarColor + ' text-white text-xs font-bold flex items-center justify-center flex-shrink-0'}>
                        {emp.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.id} &middot; {emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />{emp.department}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs"><Mail className="w-3 h-3 text-slate-400" />{emp.email}</div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs"><Phone className="w-3 h-3 text-slate-400" />{emp.phone}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-slate-500 text-xs">{emp.joinDate}</td>
                  <td className="px-5 py-4">
                    <span className={'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ' + statusConfig[emp.status].className}>
                      {statusConfig[emp.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No employees found</p>
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {mockEmployees.length} employees
        </div>
      </div>
    </div>
  );
};
