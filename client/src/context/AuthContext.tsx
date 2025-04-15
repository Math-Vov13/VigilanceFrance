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
      const token = tokenService.getRefreshToken();
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        const { data } = await authApi.verifyToken(); // This will auto-handle 401 now
        if (data?.data?.id) {
          setUser({
            id: data.data.id,
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || '',
            profileImage: data.data.profileImage ?? undefined,
          });
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setLoading(false);
      }
    };
  
    initializeAuth();
  }, []);

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await authApi.refreshToken();
      if (data._rft) {
        tokenService.setRefreshToken(data._rft);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      tokenService.clearRefreshToken();
      setUser(null);
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.login(email, password);
      
      // Check if the response has the required data
      if (!data._rft) throw new Error('Échec de la connexion');

      tokenService.setRefreshToken(data._rft); // Store the refresh token

      // Create user object from the login response
      const userObject: User = {
        id: data.user, // Use the user ID directly
        firstName: '', // These will be populated by the profile API
        lastName: '',
        email,
        profileImage: undefined,
      };

      setUser(userObject); // Update user state
      
      // Fetch additional user information after login
      try {
        const profileResponse = await authApi.verifyToken();
        if (profileResponse.data?.data?.id) {
          const profileData = profileResponse.data.data;
          const updatedUser = {
            ...userObject,
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: profileData.email || email,
            profileImage: profileData.profileImage,
          };
          setUser(updatedUser);
          return { success: true, message: 'Connexion réussie', data: updatedUser };
        }
      } catch (profileErr) {
        console.error('Failed to fetch profile after login:', profileErr);
      }
      
      return { success: true, message: 'Connexion réussie', data: userObject };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id'> & { password: string }): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.register(userData);
      if (!data._rft) throw new Error('Échec de l\'inscription');

      tokenService.setRefreshToken(data._rft); // Store the refresh token
      
      const userObject: User = {
        id: data.user, // Use the user ID directly from response
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profileImage: userData.profileImage,
      };
      
      setUser(userObject);
      return { success: true, message: 'Inscription réussie', data: userObject };
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
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      tokenService.clearRefreshToken();
      setUser(null);
      setLoading(false);
    }
  }, []);

  const handleOAuth = useCallback(async (providerFn: (tokenOrCode: string) => Promise<AxiosResponse<ApiResponse<{ user: User; refreshToken: string }>>>, tokenOrCode: string, errorMessage: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await providerFn(tokenOrCode);
      tokenService.setRefreshToken(data.data?.refreshToken ?? '');
      setUser(data.data?.user ?? null); // Set user from the OAuth provider
      return { success: data.success, message: data.message, data: data.data?.user };
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
    isAuthenticated: !!user,
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