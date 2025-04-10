import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectPath = '/admin/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAdminAuth();
  
  // While checking authentication status, show a loading state or spinner
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;