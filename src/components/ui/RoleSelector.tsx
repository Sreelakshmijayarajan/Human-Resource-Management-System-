import React from 'react';
import { User, ShieldCheck, Check } from 'lucide-react';
import { UserRole } from '../../types/auth';

export interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onChange,
  disabled = false,
}) => {
  const roles: Array<{
    id: UserRole;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'employee',
      label: 'Employee',
      icon: User,
    },
    {
      id: 'hr_admin',
      label: 'HR / Admin',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
        Login as
      </label>

      <div
        role="radiogroup"
        aria-label="Select user role"
        className="grid grid-cols-2 gap-3"
      >
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(role.id)}
              className={`
                relative flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 text-left
                ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800'
                }
                ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              `}
            >
              {/* Selected indicator badge */}
              {isSelected && (
                <div
                  data-testid="selected-badge"
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm animate-fade-in"
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                  ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="text-sm font-semibold tracking-tight">
                {role.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
