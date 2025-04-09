import { createContext, useState, ReactNode, useEffect, useMemo, useCallback} from 'react';
import { User, AuthContextType } from '../types';
import { ApiResponse, authApi } from '../services/api';
import { AxiosError } from 'axios';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app initialization
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.verifyToken();
        if (response.data.data.user) {
          setUser(response.data.data.user);
        }
      } catch (err) {
        // Token invalid or expired, clear it
        localStorage.removeItem('auth_token');
        console.error('Auth token verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(email, password);
      const { user, token } = response.data.data;
      
      // Save auth token
      localStorage.setItem('auth_token', token);
      
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || undefined
      });
      
      return { success: true, data: user };
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const register = useCallback(async (userData: Omit<User, 'id'> & { password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(userData);
      const { user, token } = response.data.data;
      
      // Save auth token
      localStorage.setItem('auth_token', token);
      
      // Update state with user data
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || undefined
      });
      
      return authApi.register(userData).then(() => {});
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      // Call logout API to invalidate token on server
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear token and user data regardless of API success
      localStorage.removeItem('auth_token');
      setUser(null);
      setLoading(false);
    }
  }, [setLoading, setUser]);

  const googleAuth = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.googleAuth(token);
      const { user, token: authToken } = response.data.data;
      
      localStorage.setItem('auth_token', authToken);
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || undefined
      });
      
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue avec l\'authentification Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);
  
  const franceConnectAuth = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.franceConnectAuth(code);
      const { user, token: authToken } = response.data.data;
      
      localStorage.setItem('auth_token', authToken);
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage || undefined
      });
      
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue avec FranceConnect';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const authContextValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
    googleAuth,
    franceConnectAuth,
    isAuthenticated: !!user,
    loading,
    error
  }), [user, login, register, logout, googleAuth, franceConnectAuth, loading, error]);

  return (
    <AuthContext.Provider value={authContextValue}>
    {children}
  </AuthContext.Provider>
  );
};

