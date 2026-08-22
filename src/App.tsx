import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthLayout } from './components/layout/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { StateToolbar } from './components/dev/StateToolbar';
import { useLoginForm } from './hooks/useLoginForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { ProfilePage } from './pages/employee/ProfilePage';
import { AttendancePage } from './pages/employee/AttendancePage';
import { LeavePage } from './pages/employee/LeavePage';
import { PayrollPage } from './pages/employee/PayrollPage';
import { NotificationsPage } from './pages/employee/NotificationsPage';
import { HRDashboard } from './pages/hr/HRDashboard';
import { UserRole } from './types/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const formHook = useLoginForm({
    email: '',
    password: '',
    role: 'employee',
  });

  const handleNavigateToDashboard = (role: string) => {
    const selectedRole = role as UserRole;
    login(formHook.values.email || 'sanjay.kumar@dayflow.io', selectedRole, 'Sanjay Kumar');
    if (selectedRole === 'hr_admin') {
      navigate('/hr/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

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

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Employee Protected Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout role="employee">
              <EmployeeDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout role="employee">
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout role="employee">
              <AttendancePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leave"
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout role="employee">
              <LeavePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/payroll"
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout role="employee">
              <PayrollPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/notifications"
        element={
          <ProtectedRoute allowedRole="employee">
            <DashboardLayout role="employee">
              <NotificationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* HR Admin Protected Routes */}
      <Route
        path="/hr"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <HRDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <HRDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/*"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <HRDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
