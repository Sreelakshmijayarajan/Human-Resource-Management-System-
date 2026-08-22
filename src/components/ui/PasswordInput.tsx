import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { InputField, InputFieldProps } from './InputField';

export interface PasswordInputProps extends Omit<InputFieldProps, 'type' | 'leftIcon' | 'rightElement'> {
  showPasswordToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id = 'password',
  label = 'Password',
  placeholder = 'Enter your password',
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    if (!disabled) {
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <InputField
      id={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      disabled={disabled}
      leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
      rightElement={
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={disabled}
          tabIndex={0}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="text-slate-400 hover:text-slate-600 focus:text-blue-600 focus:outline-none transition-colors p-1 rounded-md"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-slate-500" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4 text-slate-400" aria-hidden="true" />
          )}
        </button>
      }
      {...props}
    />
  );
};
