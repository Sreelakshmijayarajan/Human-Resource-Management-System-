import React from 'react';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { LeavePolicy } from '../../types/leave';
import { StatusBadge } from '../ui/StatusBadge';

interface LeavePolicyCardProps {
  policy: LeavePolicy;
  onEdit: (policy: LeavePolicy) => void;
  onDelete: (policy: LeavePolicy) => void;
}

export const LeavePolicyCard: React.FC<LeavePolicyCardProps> = ({
  policy,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <StatusBadge leaveType={policy.type} customLabel={policy.name} />
          </div>
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(policy)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit policy"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(policy)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete policy"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50/80 p-3 rounded-xl">
            <span className="text-xs font-semibold text-slate-400 block mb-0.5">Annual Quota</span>
            <span className="text-xl font-extrabold text-slate-900">{policy.annualQuota} Days</span>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl">
            <span className="text-xs font-semibold text-slate-400 block mb-0.5">Accrual</span>
            <span className="text-sm font-bold text-slate-800 capitalize flex items-center gap-1.5 mt-1">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
              {policy.accrualMethod}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Carry Forward:</span>
            <span className="font-semibold text-slate-800">
              {policy.carryForwardAllowed ? `Allowed (Max ${policy.maxCarryForwardDays} days)` : 'Disabled'}
            </span>
          </div>
          <div className="py-1.5 border-t border-slate-100">
            <span className="text-slate-500 font-medium block mb-1.5">Applicable Employment:</span>
            <div className="flex flex-wrap gap-1">
              {policy.applicableEmploymentTypes.map((emp) => (
                <span
                  key={emp}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md text-[11px]"
                >
                  {emp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
