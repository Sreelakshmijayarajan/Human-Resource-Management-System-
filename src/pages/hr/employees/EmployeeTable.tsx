import React from 'react';
import { Employee } from '../../../types';
import { StatusBadge, BadgeStatus } from '../../../components/ui/StatusBadge';
import { Building2, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Department</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Contact</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Joined</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th className="px-5 py-3.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {employees.map(emp => (
            <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors group">
              <td className="px-5 py-4">
                <Link to={`/hr/employees/${emp.id}`} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${emp.avatarColor} text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {emp.avatarInitials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.id} &middot; {emp.designation}</p>
                  </div>
                </Link>
              </td>
              <td className="px-5 py-4 hidden md:table-cell">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />{emp.department}
                </div>
              </td>
              <td className="px-5 py-4 hidden lg:table-cell">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium"><Mail className="w-3 h-3 text-slate-400" />{emp.email}</div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium"><Phone className="w-3 h-3 text-slate-400" />{emp.phone}</div>
                </div>
              </td>
              <td className="px-5 py-4 hidden sm:table-cell text-slate-500 text-xs font-medium">{new Date(emp.dateOfJoining).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td className="px-5 py-4">
                <StatusBadge status={emp.status as BadgeStatus} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/hr/employees/${emp.id}`} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" title="View Profile">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button onClick={() => onEdit(emp)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(emp)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
