import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthLayout } from './components/layout/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { StateToolbar } from './components/dev/StateToolbar';
import { useLoginForm } from './hooks/useLoginForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Employee pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { ProfilePage } from './pages/employee/ProfilePage';
import { AttendancePage } from './pages/employee/AttendancePage';
import { LeavePage } from './pages/employee/LeavePage';
import { PayrollPage } from './pages/employee/PayrollPage';
import { NotificationsPage } from './pages/employee/NotificationsPage';

// HR Admin pages
import { HRDashboard } from './pages/hr/HRDashboard';
import { EmployeeManagementPage } from './pages/hr/EmployeeManagementPage';
import { AttendanceRecordsPage } from './pages/hr/AttendanceRecordsPage';
import { LeaveApprovalsPage } from './pages/hr/LeaveApprovalsPage';
import { PayrollManagementPage } from './pages/hr/PayrollManagementPage';
import { ReportsPage } from './pages/hr/ReportsPage';
import { HRNotificationsPage } from './pages/hr/HRNotificationsPage';
import { RoleAccessPage } from './pages/hr/RoleAccessPage';
import { HRSettingsPage } from './pages/hr/HRSettingsPage';
import { UserRole } from './types/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const formHook = useLoginForm({
    email: '',
    password: '',
    role: 'hr_admin',
  });

  const handleNavigateToDashboard = (role: string) => {
    const selectedRole = role as UserRole;
    login(formHook.values.email || 'umau35579@dayflow.io', selectedRole, selectedRole === 'hr_admin' ? 'Uma Umamaheshwari' : 'Sanjay Kumar');
    if (selectedRole === 'hr_admin') {
      navigate('/hr');
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
        path="/hr/employees"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <EmployeeManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/attendance"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <AttendanceRecordsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/leave"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <LeaveApprovalsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/leave/*"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <LeaveApprovalsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/payroll"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <PayrollManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/payroll/*"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <PayrollManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/reports"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <ReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/notifications"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <HRNotificationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/roles"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <RoleAccessPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/settings"
        element={
          <ProtectedRoute allowedRole="hr_admin">
            <DashboardLayout role="hr_admin">
              <HRSettingsPage />
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
