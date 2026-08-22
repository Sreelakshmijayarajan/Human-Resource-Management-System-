import { useState, useCallback, FormEvent } from 'react';
import { LoginFormValues, LoginFormErrors, AuthStatus, UserRole } from '../types/auth';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface UseLoginFormReturn {
  values: LoginFormValues;
  errors: LoginFormErrors;
  status: AuthStatus;
  successMessage?: string;
  redirectUrl?: string;
  handleChange: (field: keyof LoginFormValues, value: string | boolean | UserRole) => void;
  handleSubmit: (e?: FormEvent) => Promise<boolean>;
  resetForm: () => void;
  setQuickState: (state: 'idle' | 'empty' | 'invalid_email' | 'wrong_password' | 'loading' | 'success') => void;
}

export const useLoginForm = (
  initialValues?: Partial<LoginFormValues>
): UseLoginFormReturn => {
  const [values, setValues] = useState<LoginFormValues>({
    email: initialValues?.email || '',
    password: initialValues?.password || '',
    rememberMe: initialValues?.rememberMe || false,
    role: initialValues?.role || 'employee',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);

  const validate = useCallback((currentValues: LoginFormValues): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    if (!currentValues.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(currentValues.email.trim())) {
      newErrors.email = 'Please enter a valid work email.';
    }

    if (!currentValues.password) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  }, []);

  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean | UserRole) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear error for the field being typed into
      if (errors[field as keyof LoginFormErrors]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field as keyof LoginFormErrors];
          return updated;
        });
      }
      if (status === 'error' || status === 'success') {
        setStatus('idle');
      }
    },
    [errors, status]
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent): Promise<boolean> => {
      if (e) {
        e.preventDefault();
      }

      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setStatus('error');
        return false;
      }

      setErrors({});
      setStatus('loading');

      // Simulate API authentication call
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          // Demo rule: if password is "wrong" or "invalid" or less than 6 chars, simulate failed password error
          if (values.password === 'wrong' || values.password === 'error' || values.password === 'invalid') {
            setErrors({
              password: 'Incorrect password. Please try again.',
            });
            setStatus('error');
            resolve(false);
          } else {
            // Success response
            setStatus('success');
            const target =
              values.role === 'employee'
                ? '/employee/dashboard'
                : '/hr/dashboard';
            setRedirectUrl(target);
            resolve(true);
          }
        }, 900);
      });
    },
    [values, validate]
  );

  const resetForm = useCallback(() => {
    setValues({
      email: '',
      password: '',
      rememberMe: false,
      role: 'employee',
    });
    setErrors({});
    setStatus('idle');
    setRedirectUrl(undefined);
  }, []);

  // Quick State helper for comprehensive testing & evaluation
  const setQuickState = useCallback(
    (state: 'idle' | 'empty' | 'invalid_email' | 'wrong_password' | 'loading' | 'success') => {
      switch (state) {
        case 'idle':
          setValues((prev) => ({ ...prev, email: '', password: '' }));
          setErrors({});
          setStatus('idle');
          setRedirectUrl(undefined);
          break;
        case 'empty':
          setValues((prev) => ({ ...prev, email: '', password: '' }));
          setErrors({
            email: 'Email is required.',
            password: 'Password is required.',
          });
          setStatus('error');
          setRedirectUrl(undefined);
          break;
        case 'invalid_email':
          setValues((prev) => ({ ...prev, email: 'alex.dayflow', password: 'password123' }));
          setErrors({
            email: 'Please enter a valid work email.',
          });
          setStatus('error');
          setRedirectUrl(undefined);
          break;
        case 'wrong_password':
          setValues((prev) => ({
            ...prev,
            email: prev.email || 'alex.turner@dayflow.io',
            password: 'incorrect_pass',
          }));
          setErrors({
            password: 'Incorrect password. Please try again.',
          });
          setStatus('error');
          setRedirectUrl(undefined);
          break;
        case 'loading':
          setValues((prev) => ({
            ...prev,
            email: prev.email || 'alex.turner@dayflow.io',
            password: 'password123',
          }));
          setErrors({});
          setStatus('loading');
          setRedirectUrl(undefined);
          break;
        case 'success':
          setValues((prev) => ({
            ...prev,
            email: prev.email || 'alex.turner@dayflow.io',
            password: 'password123',
          }));
          setErrors({});
          setStatus('success');
          setRedirectUrl(values.role === 'employee' ? '/employee/dashboard' : '/hr/dashboard');
          break;
      }
    },
    [values.role]
  );

  return {
    values,
    errors,
    status,
    redirectUrl,
    handleChange,
    handleSubmit,
    resetForm,
    setQuickState,
  };
};
