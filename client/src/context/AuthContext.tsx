import { createContext, useState, ReactNode, useEffect, useMemo, useCallback, useContext } from 'react';
import { User, AuthContextType } from '../types';
import { ApiResponse, authApi } from '../services/api';
import { AxiosError } from 'axios';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const checkAuthStatus = async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      let attempts = 0;
      const maxAttempts = 3;
    
      try {
        if (attempts >= maxAttempts) {
          localStorage.removeItem('refresh_token');
          setLoading(false);
          return;
        }
        attempts++;
        
        const response = await authApi.verifyToken();
        const userData = response.data.data;
        
        if (userData && userData.id) {
          setUser({
            id: userData.id,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            profileImage: userData.profileImage || undefined
          });
        }
      } catch (err) {
        localStorage.removeItem('refresh_token');
        console.error('Auth token verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await authApi.refreshToken();
      const { connected, _rft } = response.data;
      
      if (connected && _rft) {
        localStorage.setItem('refresh_token', _rft);
        return true;
      }
      
      return false;
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
      const { connected, user: username, _rft } = response.data;

      if (!connected || !_rft) {
        throw new Error('Connexion échouée - Données invalides reçues du serveur');
      }

      localStorage.setItem('refresh_token', _rft);

      const userObject = {
        id: "temp-id",
        firstName: username.split(/(?=[A-Z])/)[0] || "",
        lastName: username.split(/(?=[A-Z])/).slice(1).join("") || "",
        email: email,
        profileImage: undefined
      };

      setUser(userObject);

      return {
        success: true,
        message: "Connexion réussie",
        data: userObject
      };
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion";
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

      if (!response || !response.data) {
        throw new Error('Response invalid from server');
      }

      const { connected, _rft } = response.data;

      if (!connected || !_rft) {
        throw new Error('Inscription échouée - Données invalides reçues du serveur');
      }

      localStorage.setItem('refresh_token', _rft);
      setUser({
        id: "temp-id",
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profileImage: userData.profileImage
      });

    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
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

      localStorage.setItem('refresh_token', refreshToken);

      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage ?? undefined
      });

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

      localStorage.setItem('refresh_token', refreshToken);

      setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage ?? undefined
      });

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
