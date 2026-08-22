import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  helperText?: string;
  id: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  leftIcon,
  rightElement,
  helperText,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="w-full text-left space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700 tracking-tight"
      >
        {label}
      </label>

      <div className="relative rounded-xl transition-all duration-150 group">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId}
          className={`
            w-full rounded-xl border text-sm font-normal text-slate-800 placeholder-slate-400 
            transition-all duration-150 ease-in-out
            bg-white
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightElement ? 'pr-11' : 'pr-3.5'}
            py-2.5
            ${
              error
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }
            ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : ''}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 animate-slide-up mt-1"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};
