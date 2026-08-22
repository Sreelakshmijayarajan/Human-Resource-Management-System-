import React, { useState } from 'react';
import { Mail, Shield, CheckCircle2 } from 'lucide-react';
import { useLoginForm } from '../../hooks/useLoginForm';
import { RoleSelector } from '../ui/RoleSelector';
import { InputField } from '../ui/InputField';
import { PasswordInput } from '../ui/PasswordInput';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';

export interface LoginFormProps {
  formHook: ReturnType<typeof useLoginForm>;
  onNavigateToDashboard?: (role: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formHook,
  onNavigateToDashboard,
}) => {
  const {
    values,
    errors,
    status,
    redirectUrl,
    handleChange,
    handleSubmit,
  } = formHook;

  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const isFormDisabled = status === 'loading';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await handleSubmit(e);
    if (ok && onNavigateToDashboard) {
      setTimeout(() => {
        onNavigateToDashboard(values.role);
      }, 1200);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordNotice(true);
    setTimeout(() => setForgotPasswordNotice(false), 4000);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-100/80 transition-all duration-300">
      {/* Header */}
      <div className="text-center space-y-1.5 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back!
        </h2>
        <p className="text-sm text-slate-500 font-normal">
          Sign in to continue to Dayflow
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Role Selector */}
        <RoleSelector
          selectedRole={values.role}
          onChange={(newRole) => handleChange('role', newRole)}
          disabled={isFormDisabled}
        />

        {/* Work Email Field */}
        <InputField
          id="work-email"
          label="Work Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your work email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          disabled={isFormDisabled}
          leftIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
        />

        {/* Password Field */}
        <PasswordInput
          id="work-password"
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          disabled={isFormDisabled}
        />

        {/* Options: Remember me + Forgot Password */}
        <div className="flex items-center justify-between pt-0.5">
          <Checkbox
            id="remember-me"
            label="Remember me"
            checked={values.rememberMe}
            onChange={(e) => handleChange('rememberMe', e.target.checked)}
            disabled={isFormDisabled}
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isFormDisabled}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Forgot password notification badge if clicked */}
        {forgotPasswordNotice && (
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800 animate-slide-up text-center">
            Password reset instructions are provisioned directly by your HR Administrator.
          </div>
        )}

        {/* Primary CTA Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={status === 'loading'}
            loadingText="Signing in..."
            disabled={isFormDisabled}
            className="w-full text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35"
          >
            Sign In
          </Button>
        </div>

        {/* Success Alert Banner */}
        {status === 'success' && (
          <div
            data-testid="success-banner"
            role="status"
            className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium animate-slide-up"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Login successful! Redirecting...</span>
            </div>
            {redirectUrl && (
              <span className="text-[11px] font-mono font-semibold bg-emerald-100/80 px-2 py-0.5 rounded text-emerald-900">
                {redirectUrl}
              </span>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Your information is securely protected.</span>
        </div>
      </form>
    </div>
  );
};
