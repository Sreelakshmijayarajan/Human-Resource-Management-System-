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
        className="block text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight"
      >
        {label}
      </label>

      <div className="relative rounded-xl transition-all duration-150 group">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId}
          className={`
            w-full rounded-xl border text-sm font-normal text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 
            transition-all duration-150 ease-in-out
            bg-white dark:bg-slate-800/80
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightElement ? 'pr-11' : 'pr-3.5'}
            py-2.5
            ${
              error
                ? 'border-red-400 dark:border-red-500 bg-red-50/20 dark:bg-red-950/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950/50'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950/50'
            }
            ${disabled ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-700' : ''}
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
