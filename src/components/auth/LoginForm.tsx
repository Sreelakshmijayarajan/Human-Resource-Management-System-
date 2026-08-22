import React, { useState } from 'react';
import { Mail, Shield, CheckCircle2, ShieldCheck, User, Zap, Sparkles } from 'lucide-react';
import { useLoginForm } from '../../hooks/useLoginForm';
import { RoleSelector } from '../ui/RoleSelector';
import { InputField } from '../ui/InputField';
import { PasswordInput } from '../ui/PasswordInput';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { UserRole } from '../../types/auth';
import { FlipFadeText } from '../ui/flip-fade-text';

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
      }, 800);
    }
  };

  // Quick Demo Login Handlers
  const handleQuickDemoLogin = async (role: UserRole) => {
    if (role === 'hr_admin') {
      handleChange('role', 'hr_admin');
      handleChange('email', 'umau35579@dayflow.io');
      handleChange('password', 'password123');
    } else {
      handleChange('role', 'employee');
      handleChange('email', 'sanjay.kumar@dayflow.io');
      handleChange('password', 'password123');
    }

    // Trigger form submit directly
    setTimeout(async () => {
      if (onNavigateToDashboard) {
        onNavigateToDashboard(role);
      }
    }, 400);
  };

  const handleRoleChange = (newRole: UserRole) => {
    handleChange('role', newRole);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordNotice(true);
    setTimeout(() => setForgotPasswordNotice(false), 4000);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-9 shadow-card border border-slate-100/80 dark:border-slate-800 transition-all duration-300 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dayflow HR Management Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          <FlipFadeText
            words={['Welcome back!']}
            loop={false}
            letterDuration={0.45}
            staggerDelay={0.04}
            textClassName="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          />
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
          Select a role or use quick 1-click demo access below.
        </p>
      </div>

      {/* Quick Demo Access Bar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-blue-50/70 to-slate-50 dark:from-indigo-950/50 dark:via-blue-950/50 dark:to-slate-850 border border-indigo-100/80 dark:border-indigo-900/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            1-Click Demo Logins
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Pre-loaded mock data</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('hr_admin')}
            disabled={isFormDisabled}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 bg-white dark:bg-slate-800 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/70 text-left transition-all group shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                Admin Demo
              </p>
              <p className="text-[10px] text-slate-400 truncate">HR & Operations</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('employee')}
            disabled={isFormDisabled}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200/80 dark:border-blue-800/60 bg-white dark:bg-slate-800 hover:bg-blue-50/70 dark:hover:bg-blue-950/70 text-left transition-all group shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                Employee Demo
              </p>
              <p className="text-[10px] text-slate-400 truncate">Self-Service</p>
            </div>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {/* Role Selector */}
        <RoleSelector
          selectedRole={values.role}
          onChange={handleRoleChange}
          disabled={isFormDisabled}
        />

        {/* Work Email Field */}
        <InputField
          id="work-email"
          label="Work Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder={values.role === 'hr_admin' ? 'umau35579@dayflow.io' : 'sanjay.kumar@dayflow.io'}
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
          placeholder="••••••••••••"
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
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Forgot password notification badge if clicked */}
        {forgotPasswordNotice && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 animate-slide-up text-center">
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
            className="w-full text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35"
          >
            Login
          </Button>
        </div>

        {/* Success Alert Banner */}
        {status === 'success' && (
          <div
            data-testid="success-banner"
            role="status"
            className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium animate-slide-up"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Login successful! Redirecting...</span>
            </div>
            {redirectUrl && (
              <span className="text-[11px] font-mono font-semibold bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-200">
                {redirectUrl}
              </span>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Secured with role-based enterprise access control.</span>
        </div>
      </form>
    </div>
  );
};
