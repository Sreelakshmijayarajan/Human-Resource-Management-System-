import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  checked,
  onChange,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group text-sm ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`
            w-4 h-4 rounded-md border transition-all duration-150 flex items-center justify-center
            ${
              checked
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:border-slate-400 dark:group-hover:border-slate-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 peer-focus-visible:ring-offset-1'
            }
            ${disabled ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : ''}
          `}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />}
        </div>
      </div>
      <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors font-medium">
        {label}
      </span>
    </label>
  );
};
