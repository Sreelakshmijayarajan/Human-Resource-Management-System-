import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  requiredRole: 'hr_admin' | 'employee';
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { role } = useAuth();
  const location = useLocation();

  if (role !== requiredRole) {
    // redirect to login or home if not authorized
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
