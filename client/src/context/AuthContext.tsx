import { createContext, useState, ReactNode, useEffect, useMemo, useCallback, useContext } from 'react';
import { User, AuthContextType } from '../types';
import { ApiResponse, authApi } from '../services/api';
import { AxiosError } from 'axios';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Fonction pour rafraîchir le token d'authentification
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await authApi.refreshToken();
      
      if (response.data && response.data._rft) {
        localStorage.setItem('refresh_token', response.data._rft);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Échec du rafraîchissement du token:', err);
      localStorage.removeItem('refresh_token');
      setUser(null);
      return false;
    }
  }, []);
  
  // Fonction pour récupérer les informations de l'utilisateur
  // Modifiez cette fonction dans votre AuthContext.tsx
const fetchUserProfile = useCallback(async (): Promise<User | null> => {
  try {
    // Ajout d'un léger délai pour donner au serveur le temps de terminer l'enregistrement
    if (localStorage.getItem('just_registered') === 'true') {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.removeItem('just_registered');
    }
    
    const response = await authApi.verifyToken();
    console.log("Réponse du profil:", response.data); // Ajout pour débogage
    
    if (response.data?.data && response.data.data.id) {
      const userData = response.data.data;
      return {
        id: userData.id,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        profileImage: userData.profileImage || undefined
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return null;
  }
}, []);
  
  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      
      // Vérifier si un refresh token existe
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        setLoading(false);
        setInitialized(true);
        return;
      }
      
      // Tenter de récupérer le profil utilisateur
      let userProfile = await fetchUserProfile();
      
      // Si la récupération échoue, essayer de rafraîchir le token et réessayer
      if (!userProfile) {
        const refreshSuccess = await refreshAuthToken();
        
        if (refreshSuccess) {
          userProfile = await fetchUserProfile();
          
          if (!userProfile) {
            // Même après le refresh, impossible de récupérer le profil
            localStorage.removeItem('refresh_token');
          }
        } else {
          // Échec du rafraîchissement, supprimer le token
          localStorage.removeItem('refresh_token');
        }
      }
      
      setUser(userProfile);
      setLoading(false);
      setInitialized(true);
    };
    
    // Exécuter la vérification d'authentification au chargement
    checkAuthStatus();
    
    // Écouteur pour l'événement de session expirée
    const handleSessionExpired = () => {
      console.log("Session expirée, déconnexion automatique");
      setUser(null);
      localStorage.removeItem('refresh_token');
    };
    
    window.addEventListener('auth:session-expired', handleSessionExpired);
    
    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [fetchUserProfile, refreshAuthToken]);

  // Fonction de connexion
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
      
      // Créer un utilisateur temporaire avec les informations de base
      const tempUser = {
        id: "temp-id",
        firstName: username ? username.split(/(?=[A-Z])/)[0] || "" : "",
        lastName: username ? username.split(/(?=[A-Z])/).slice(1).join("") || "" : "",
        email: email,
        profileImage: undefined
      };
      
      setUser(tempUser); // Définir l'utilisateur temporairement
      
      // Ajouter un délai avant de tenter de récupérer le profil
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Essayer de récupérer le profil complet, mais ne pas échouer si cela ne fonctionne pas
      try {
        const userProfile = await fetchUserProfile();
        if (userProfile) {
          setUser(userProfile);
          return {
            success: true,
            message: "Connexion réussie",
            data: userProfile
          };
        }
      } catch (profileErr) {
        console.warn("Impossible de récupérer le profil complet après la connexion, utilisation des données temporaires", profileErr);
      }
      
      // Si la récupération du profil a échoué, retourner l'utilisateur temporaire
      return {
        success: true,
        message: "Connexion réussie",
        data: tempUser
      };
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Fonction d'inscription
  const register = useCallback(async (userData: Omit<User, 'id'> & { password: string }): Promise<void> => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await authApi.register(userData);
  
      if (!response || !response.data) {
        throw new Error('Réponse invalide du serveur');
      }
  
      const { connected, _rft } = response.data;
  
      if (!connected || !_rft) {
        throw new Error('Inscription échouée - Données invalides reçues du serveur');
      }
  
      localStorage.setItem('refresh_token', _rft);
      localStorage.setItem('just_registered', 'true'); // Marquer l'inscription récente
      
      // Créer un utilisateur temporaire en attendant la récupération du profil
      const tempUser = {
        id: "temp-id",
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profileImage: userData.profileImage
      };
      
      setUser(tempUser); // Définir l'utilisateur temporairement
      
      // Essayer de récupérer le profil complet, mais ne pas échouer si cela ne fonctionne pas
      try {
        const userProfile = await fetchUserProfile();
        if (userProfile) {
          setUser(userProfile);
        }
      } catch (profileErr) {
        console.warn("Impossible de récupérer le profil complet après l'inscription, utilisation des données temporaires", profileErr);
        // Continuer en utilisant les données temporaires
      }
  
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Fonction de déconnexion
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
  }, []);

  // Fonction d'authentification Google
  const googleAuth = useCallback(async (token: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.googleAuth(token);
      const { user, refreshToken } = response.data.data;

      localStorage.setItem('refresh_token', refreshToken);

      // Récupérer le profil complet après l'authentification Google
      const userProfile = await fetchUserProfile();
      
      if (!userProfile) {
        throw new Error('Impossible de récupérer les informations du profil');
      }
      
      setUser(userProfile);

      return {
        success: response.data.success,
        message: response.data.message,
        data: userProfile
      };
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message ?? 'Une erreur est survenue avec l\'authentification Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Fonction d'authentification FranceConnect
  const franceConnectAuth = useCallback(async (code: string): Promise<ApiResponse<User>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.franceConnectAuth(code);
      const { user, refreshToken } = response.data.data;

      localStorage.setItem('refresh_token', refreshToken);

      // Récupérer le profil complet après l'authentification FranceConnect
      const userProfile = await fetchUserProfile();
      
      if (!userProfile) {
        throw new Error('Impossible de récupérer les informations du profil');
      }
      
      setUser(userProfile);

      return {
        success: response.data.success,
        message: response.data.message,
        data: userProfile
      };
    } catch (err) {
      const error = err as AxiosError<ApiResponse<null>>;
      const errorMessage = error.response?.data?.message ?? 'Une erreur est survenue avec FranceConnect';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Valeur du contexte d'authentification
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
    error,
    initialized
  }), [user, login, register, logout, googleAuth, franceConnectAuth, refreshAuthToken, loading, error, initialized]);

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