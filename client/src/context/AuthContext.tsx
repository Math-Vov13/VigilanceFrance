import { createContext, useState, ReactNode, useEffect, useMemo, useCallback, useContext } from 'react';
import { User, AuthContextType } from '../types';
import { ApiResponse, authApi } from '../services/api';
import { tokenService } from '../services/tokenService';
import { AxiosError, AxiosResponse } from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for the refresh token in the cookies
      const token = tokenService.getRefreshToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // If a refresh token exists, verify the token
      try {
        const { data } = await authApi.verifyToken();
        if (data?.data?.id) {
          setUser({
            id: data.data.id,
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || '',
            profileImage: data.data.profileImage || undefined,
          });
        }
      } catch (err) {
        console.error('Auth token verification failed:', err);
        tokenService.clearRefreshToken(); // Clear token on failure
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await authApi.refreshToken();
      if (data.connected && data._rft) {
        tokenService.setRefreshToken(data._rft); // Store the new refresh token
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      tokenService.clearRefreshToken(); // Clear invalid refresh token
      setUser(null); // Log the user out if the token refresh fails
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.login(email, password);
      if (!data.connected || !data._rft) throw new Error('Échec de la connexion');

      tokenService.setRefreshToken(data._rft); // Store the refresh token

      // Create user object from the login response
      const userObject: User = {
        id: 'temp-id', // You should replace this with actual user ID from response if available
        firstName: data.user.split(/(?=[A-Z])/)[0] || '',
        lastName: data.user.split(/(?=[A-Z])/).slice(1).join('') || '',
        email,
        profileImage: undefined, // Set this from data if available
      };

      setUser(userObject); // Update user state
      return { success: true, message: 'Connexion réussie', data: userObject };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id'> & { password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.register(userData);
      if (!data.connected || !data._rft) throw new Error('Échec de l\'inscription');

      tokenService.setRefreshToken(data._rft); // Store the refresh token
      setUser({ ...userData, id: 'temp-id' }); // Replace 'temp-id' with actual user ID
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout(); // API call to handle logout if necessary
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      tokenService.clearRefreshToken(); // Clear the refresh token on logout
      setUser(null); // Clear user data
      setLoading(false);
    }
  }, []);

  const handleOAuth = useCallback(async (providerFn: (tokenOrCode: string) => Promise<AxiosResponse<ApiResponse<{ user: User; refreshToken: string }>>>, tokenOrCode: string, errorMessage: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await providerFn(tokenOrCode);
      tokenService.setRefreshToken(data.data.refreshToken); // Store the new refresh token
      setUser(data.data.user); // Set user from the OAuth provider
      return { success: data.success, message: data.message, data: data.data.user };
    } catch (err) {
      const msg = (err as AxiosError<ApiResponse<null>>).response?.data?.message ?? errorMessage;
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const googleAuth = (token: string) => handleOAuth(authApi.googleAuth, token, 'Erreur Google Auth');
  const franceConnectAuth = (code: string) => handleOAuth(authApi.franceConnectAuth, code, 'Erreur FranceConnect');

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user, // Check if user exists for authentication status
    loading,
    error,
    login,
    register,
    logout,
    googleAuth,
    franceConnectAuth,
    refreshAuthToken,
  }), [user, loading, error, login, register, logout, googleAuth, franceConnectAuth, refreshAuthToken]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
