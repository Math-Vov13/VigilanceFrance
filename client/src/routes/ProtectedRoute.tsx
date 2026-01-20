import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  redirectPath = '/auth'
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, isInitialized } = useAuth();

  // Show loading spinner while auth is initializing
  // This prevents premature redirects during token refresh
  if (loading || !isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Only redirect after auth is fully initialized and user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;