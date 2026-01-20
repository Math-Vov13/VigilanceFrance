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
  const [isInitialized, setIsInitialized] = useState(false);
  const [skipInitialization, setSkipInitialization] = useState(false);

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        console.log('❌ No refresh token available');
        return false;
      }

      console.log('🔄 Attempting to refresh token...');
      const { status } = await authApi.refreshToken();
      if (status === 200) {
        console.log('✅ Token refreshed successfully');
        return true;
      }
      console.log('❌ Token refresh failed with status:', status);
      return false;
    } catch (err) {
      console.error('❌ Failed to refresh token:', err);
      tokenService.clearRefreshToken();
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 Starting auth initialization...');

      // Skip initialization if user was just authenticated (prevents duplicate validation)
      if (skipInitialization) {
        console.log('⏭️ Skipping initialization - user already authenticated');
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      // Check if refresh token exists before attempting verification
      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        // No tokens = user is not logged in, which is fine for public pages
        console.log('ℹ️ No refresh token found - user not authenticated');
        setUser(null);
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      try {
        const { data } = await authApi.verifyToken();
        console.log('📦 Full API Response:', data);

        // Normalize the structure — handle both wrapped and raw responses
        const profile = data?.data || data;

        if (profile && typeof profile === 'object' && '_id' in profile) {
          console.log('✅ User profile found:', profile);
          setUser({
            _id: (profile as User)._id,
            firstName: (profile as User).firstName || '',
            lastName: (profile as User).lastName || '',
            email: (profile as User).email || '',
            profileImage: (profile as User).profileImage ?? undefined,
          });
        } else {
          console.warn('⚠️ No valid user data found in profile response');
          setUser(null);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Access token expired, try to refresh
          console.warn('🔄 Access token expired, trying refresh...');
          const success = await refreshAuthToken();
          
          if (success) {
            // Retry verification after successful refresh
            try {
              const { data } = await authApi.verifyToken();
              const profile = data?.data || data;
              if (profile && typeof profile === 'object' && '_id' in profile) {
                setUser({
                  _id: (profile as User)._id,
                  firstName: (profile as User).firstName || '',
                  lastName: (profile as User).lastName || '',
                  email: (profile as User).email || '',
                  profileImage: (profile as User).profileImage ?? undefined,
                });
              } else {
                setUser(null);
              }
            } catch (retryErr) {
              console.error('❌ Failed to verify after refresh:', retryErr);
              setUser(null);
              tokenService.clearRefreshToken();
            }
          } else {
            // Refresh failed - clear everything
            setUser(null);
            tokenService.clearRefreshToken();
          }
        } else {
          // Other errors (network, server error, etc.)
          console.error('❌ Auth verification failed:', err);
          setUser(null);
          // Don't clear tokens on network errors - might be temporary
          if (err.response?.status >= 400 && err.response?.status < 500) {
            // Clear tokens only on client errors (4xx)
            tokenService.clearRefreshToken();
          }
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();
  }, [refreshAuthToken, skipInitialization]);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authApi.login(email, password);
      console.log('🔍 Login Response:', data);

      if (!data._rft) {
        console.error('❌ No refresh token in login response!', data);
        throw new Error('Échec de la connexion');
      }

      tokenService.setRefreshToken(data._rft);
      console.log('✅ Login: Refresh token stored:', data._rft);

      const userObject: User = {
        _id: data.user,
        firstName: '',
        lastName: '',
        email,
        profileImage: undefined,
      };

      setUser(userObject);

      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const profileResponse = await authApi.verifyToken();
        const userData = profileResponse.data?.data;

        if (userData?._id || userData?._id) {
          const userId = userData._id || userData._id;
          const updatedUser = {
            ...userObject,
            id: userId.toString(),
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || email,
            profileImage: userData.profileImage,
          };
          setUser(updatedUser);
          setSkipInitialization(true); // Prevent duplicate validation on next mount
          setIsInitialized(true);
          return { success: true, message: 'Connexion réussie', data: updatedUser };
        }
      } catch (profileErr) {
        console.error('Failed to fetch profile after login:', profileErr);
      }

      setSkipInitialization(true); // Prevent duplicate validation on next mount
      setIsInitialized(true);
      return { success: true, message: 'Connexion réussie', data: userObject };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(message);
      tokenService.clearRefreshToken();
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
      console.log('🔍 Register Response:', data);

      if (!data._rft) {
        console.error('❌ No refresh token in register response!', data);
        throw new Error('Échec de l\'inscription');
      }

      tokenService.setRefreshToken(data._rft);
      console.log('✅ Register: Refresh token stored:', data._rft);

      const userObject: User = {
        _id: data.user,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profileImage: userData.profileImage,
      };

      setUser(userObject);
      setSkipInitialization(true); // Prevent duplicate validation on next mount
      setIsInitialized(true);
      return { success: true, message: 'Inscription réussie', data: userObject };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setError(message);
      tokenService.clearRefreshToken();
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Call backend logout endpoint
      await authApi.logout();
      console.log('✅ Logout request successful');
    } catch (err) {
      console.error('❌ Logout request failed:', err);
      // Continue with cleanup even if backend fails
    } finally {
      // Always clear local state and tokens
      tokenService.clearRefreshToken();
      setUser(null);
      setSkipInitialization(false); // Reset flag so next login can re-validate
      setLoading(false);

      // Optional: Force reload to clear any remaining cookies
      // Uncomment if cookie clearing issues persist
      // setTimeout(() => window.location.href = '/auth', 100);
    }
  }, []);

  const handleOAuth = useCallback(async (providerFn: (tokenOrCode: string) => Promise<AxiosResponse<ApiResponse<{ user: User; refreshToken: string }>>>, tokenOrCode: string, errorMessage: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await providerFn(tokenOrCode);
      console.log('🔍 OAuth Response:', data);

      // Extract refresh token from response
      const refreshToken = data.data?.refreshToken || data._rft;
      console.log('🔑 Refresh Token extracted:', refreshToken);

      if (!refreshToken) {
        console.error('❌ No refresh token in response!', data);
        throw new Error('No refresh token received');
      }

      tokenService.setRefreshToken(refreshToken);
      console.log('✅ Refresh token stored in localStorage');

      setUser(data.data?.user ?? null);
      setSkipInitialization(true); // ✅ Prevent duplicate validation - OAuth already returned full user data
      setIsInitialized(true);
      console.log('✅ OAuth complete - skipping duplicate initialization');
      return { success: data.success, message: data.message, data: data.data?.user };
    } catch (err) {
      const msg = (err as AxiosError<ApiResponse<null>>).response?.data?.message ?? errorMessage;
      setError(msg);
      tokenService.clearRefreshToken();
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const googleAuth = useCallback((token: string) => handleOAuth(authApi.googleAuth, token, 'Erreur Google Auth'), [handleOAuth]);
  const githubAuth = useCallback((code: string) => handleOAuth(authApi.githubAuth, code, 'Erreur GitHub Auth'), [handleOAuth]);
  const franceConnectAuth = useCallback((code: string) => handleOAuth(authApi.franceConnectAuth, code, 'Erreur FranceConnect'), [handleOAuth]);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    isInitialized,
    error,
    login,
    register,
    logout,
    googleAuth,
    githubAuth,
    franceConnectAuth,
    refreshAuthToken,
  }), [user, loading, isInitialized, error, login, register, logout, googleAuth, githubAuth, franceConnectAuth, refreshAuthToken]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};