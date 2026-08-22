import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAppContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    const target = user?.role === 'hr_admin' ? '/hr/dashboard' : '/employee/dashboard';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
