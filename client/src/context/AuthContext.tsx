import { createContext, useState, ReactNode, useEffect, useMemo, useCallback, useContext } from 'react';
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
      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        // No need to send the auth token - it's in the HTTP-only cookie
        const response = await authApi.verifyToken();
        if (response.data.data.user) {
          setUser(response.data.data.user);
        }
      } catch (err) {
        // Token invalid or expired, clear it
        localStorage.removeItem('refresh_token');
        console.error('Auth token verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Refresh token function
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authApi.refreshToken();
      const { refreshToken } = response.data.data;
      
      // Update refresh token in localStorage
      // (Auth token is updated in HTTP-only cookie by the server)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      
      return true;
    } catch (err) {
      console.error('Failed to refresh auth token:', err);
      localStorage.removeItem('refresh_token');
      setUser(null);
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(email, password);
      const { user, refreshToken } = response.data.data;
      
      // Save refresh token in localStorage
      // (Auth token is set as HTTP-only cookie by the server)
      localStorage.setItem('refresh_token', refreshToken);
      
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage ?? undefined
      });
      
      // Return only the user part in the API response to match the expected type
      return {
        success: response.data.success,
        message: response.data.message,
        data: user
      };
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message ?? 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const register = useCallback(async (userData: Omit<User, 'id'> & { password: string }): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(userData);
      const { user, refreshToken } = response.data.data;
      
      // Save refresh token in localStorage
      // (Auth token is set as HTTP-only cookie by the server)
      localStorage.setItem('refresh_token', refreshToken);
      
      // Update state with user data
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage ?? undefined
      });
      
      // No return value
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message ?? 'Une erreur est survenue lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Call logout API to invalidate tokens on server and clear the HTTP-only cookie
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear refresh token and user data regardless of API success
      localStorage.removeItem('refresh_token');
      setUser(null);
      setLoading(false);
    }
  }, [setLoading, setUser]);

  const googleAuth = useCallback(async (token: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.googleAuth(token);
      const { user, refreshToken } = response.data.data;
      
      // Save refresh token in localStorage
      // (Auth token is set as HTTP-only cookie by the server)
      localStorage.setItem('refresh_token', refreshToken);
      
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage ?? undefined
      });
      
      // Return only the user part in the API response to match the expected type
      return {
        success: response.data.success,
        message: response.data.message,
        data: user
      };
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message ?? 'Une erreur est survenue avec l\'authentification Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);
  
  const franceConnectAuth = useCallback(async (code: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.franceConnectAuth(code);
      const { user, refreshToken } = response.data.data;
      
      // Save refresh token in localStorage
      // (Auth token is set as HTTP-only cookie by the server)
      localStorage.setItem('refresh_token', refreshToken);
      
      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage ?? undefined
      });
      
      // Return only the user part in the API response to match the expected type
      return {
        success: response.data.success,
        message: response.data.message,
        data: user
      };
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message ?? 'Une erreur est survenue avec FranceConnect';
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
    refreshAuthToken,
    isAuthenticated: !!user,
    loading,
    error
  }), [user, login, register, logout, googleAuth, franceConnectAuth, refreshAuthToken, loading, error]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};