import React from 'react';
import { Employee } from '../../../types';
import { StatusBadge, BadgeStatus } from '../../../components/ui/StatusBadge';
import { Building2, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmployeeGridProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4">
      {employees.map((emp) => (
        <div key={emp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-4">
              <Link to={`/hr/employees/${emp.id}`}>
                <div className={`w-12 h-12 rounded-xl ${emp.avatarColor} text-white text-lg font-bold flex items-center justify-center shadow-sm`}>
                  {emp.avatarInitials}
                </div>
              </Link>
              <StatusBadge status={emp.status as BadgeStatus} showIcon={false} />
            </div>
            
            <Link to={`/hr/employees/${emp.id}`} className="block mb-1">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg truncate">{emp.name}</h3>
            </Link>
            <p className="text-sm text-slate-500 font-medium truncate mb-4">{emp.designation}</p>
            
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{emp.department}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{emp.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{emp.id}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(emp)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-blue-600 transition-all">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(emp)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-red-600 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
