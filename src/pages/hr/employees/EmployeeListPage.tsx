import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { useHRData } from '../../../context/HRDataContext';
import { Employee } from '../../../types';
import { EmployeeTable } from './EmployeeTable';
import { EmployeeGrid } from './EmployeeGrid';
import { EmployeeFormPanel } from './EmployeeFormPanel';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';

export const EmployeeListPage: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHRData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.designation.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === 'All' || e.department === filterDept;
      const matchStatus = filterStatus === 'All' || e.status === filterStatus;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, filterDept, filterStatus]);

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = async (employeeData: Omit<Employee, 'id'> | Employee) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if ('id' in employeeData && employeeData.id) {
      updateEmployee(employeeData.id, employeeData);
      showToast(`Employee ${employeeData.name} updated successfully`, 'success');
    } else {
      addEmployee(employeeData as Omit<Employee, 'id'>);
      showToast(`Employee ${employeeData.name} added successfully`, 'success');
    }
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete.id);
      showToast(`Employee ${employeeToDelete.name} deleted`, 'success');
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage profiles, documents and job records</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode('table')} 
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white text-slate-700 cursor-pointer"
            >
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white text-slate-700 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-600">No employees found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'table' ? (
          <EmployeeTable employees={filteredEmployees} onEdit={handleEdit} onDelete={setEmployeeToDelete} />
        ) : (
          <EmployeeGrid employees={filteredEmployees} onEdit={handleEdit} onDelete={setEmployeeToDelete} />
        )}
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500 font-medium bg-slate-50/50">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      </div>

      <EmployeeFormPanel
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />

      <ConfirmDialog
        isOpen={!!employeeToDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete Employee"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </div>
  );
};
