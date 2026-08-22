import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { StateToolbar } from './components/dev/StateToolbar';
import { useLoginForm } from './hooks/useLoginForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HRDashboard } from './pages/HRDashboard';

import { ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps { name: string; }
const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ name }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl mb-4">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2a4 4 0 014-4h4m0 0l-2-2m2 2l-2 2M3 12h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{name}</h2>
      <p className="text-gray-500 mb-6">This module is under construction. Check back soon!</p>
      <button
        onClick={() => navigate('/hr')}
        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>
    </div>
  );
};
const AppRoutes: React.FC = () => {
  const formHook = useLoginForm({ email: '', password: '', role: 'employee' });
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleNavigateToDashboard = (role: string) => {
    setAuth({ role: role as 'hr_admin' | 'employee', email: formHook.values.email });
    navigate('/hr');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <LoginForm formHook={formHook} onNavigateToDashboard={handleNavigateToDashboard} />
            <StateToolbar currentStatus={formHook.status} onSelectState={formHook.setQuickState} />
          </>
        }
      />
      <Route
        path="/hr"
        element={
          <ProtectedRoute requiredRole="hr_admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HRDashboard />} />
        <Route path="employees" element={<PlaceholderPage name="Employee Management" />} />
        <Route path="attendance" element={<PlaceholderPage name="Attendance Management" />} />
        <Route path="leave" element={<PlaceholderPage name="Leave Management" />} />
        <Route path="payroll" element={<PlaceholderPage name="Payroll Management" />} />
        <Route path="reports" element={<PlaceholderPage name="Reports & Analytics" />} />
        <Route path="notifications" element={<PlaceholderPage name="Notifications" />} />
        <Route path="roles" element={<PlaceholderPage name="Role & Access Control" />} />
        <Route path="settings" element={<PlaceholderPage name="Settings" />} />
      </Route>
      <Route path="*" element={<div className="p-8 text-xl">404 — Page Not Found</div>} />
    </Routes>
  );
};

export const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;