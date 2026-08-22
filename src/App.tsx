import React, { useState } from 'react';
import { AuthLayout } from './components/layout/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { DashboardPreview } from './components/auth/DashboardPreview';
import { StateToolbar } from './components/dev/StateToolbar';
import { useLoginForm } from './hooks/useLoginForm';
import { UserRole } from './types/auth';

export const App: React.FC = () => {
  const formHook = useLoginForm({
    email: '',
    password: '',
    role: 'employee',
  });

  const [currentView, setCurrentView] = useState<'login' | 'dashboard'>('login');
  const [activeUserRole, setActiveUserRole] = useState<UserRole>('employee');

  const handleNavigateToDashboard = (role: string) => {
    setActiveUserRole(role as UserRole);
    setCurrentView('dashboard');
  };

  const handleReturnToLogin = () => {
    formHook.resetForm();
    setCurrentView('login');
  };

  if (currentView === 'dashboard') {
    return (
      <DashboardPreview
        role={activeUserRole}
        userEmail={formHook.values.email}
        onReturnToLogin={handleReturnToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <AuthLayout>
        <LoginForm
          formHook={formHook}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
      </AuthLayout>

      {/* State Testing Toolbar at bottom */}
      <StateToolbar
        currentStatus={formHook.status}
        onSelectState={formHook.setQuickState}
      />
    </div>
  );
};

export default App;
