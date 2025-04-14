import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../services/api';

/**
 * Hook personnalisé pour gérer les requêtes authentifiées
 * Gère automatiquement les erreurs d'authentification et la redirection vers la page de connexion si nécessaire
 */
export function useAuthenticatedRequest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshAuthToken, logout } = useAuth();

  const makeRequest = useCallback(async <T>(
    requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
    options: {
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
      redirectOnUnauthorized?: boolean;
    } = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestFn();
      
      if (options.onSuccess) {
        options.onSuccess(response.data.data);
      }
      
      return response.data.data;
    } catch (err) {
      // Vérifie si c'est une erreur 401 (non autorisé)
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        try {
          // Tente de rafraîchir le token
          const refreshed = await refreshAuthToken();
          
          if (refreshed) {
            // Si le token a été rafraîchi avec succès, réessaie la requête
            try {
              const newResponse = await requestFn();
              
              if (options.onSuccess) {
                options.onSuccess(newResponse.data.data);
              }
              
              return newResponse.data.data;
            } catch (retryErr) {
              handleError(retryErr, options);
              return null;
            }
          } else {
            // Si le rafraîchissement échoue, déconnexion
            if (options.redirectOnUnauthorized !== false) {
              await logout();
            }
            
            const errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
            setError(errorMessage);
            
            if (options.onError) {
              options.onError(errorMessage);
            }
            
            return null;
          }
        } catch (refreshErr) {
          await logout();
          handleError(refreshErr, options);
          return null;
        }
      } else {
        // Pour les autres types d'erreurs
        handleError(err, options);
        return null;
      }
    } finally {
      setLoading(false);
    }
  }, [refreshAuthToken, logout]);

  const handleError = (err: unknown, options: any) => {
    const errorMessage = err instanceof Error 
      ? err.message 
      : "Une erreur inattendue s'est produite";
    
    setError(errorMessage);
    
    if (options.onError) {
      options.onError(errorMessage);
    }
  };

  return { makeRequest, loading, error };
}

// Exemple d'utilisation:
/*
const { makeRequest, loading, error } = useAuthenticatedRequest();

// Dans une fonction ou un useEffect:
const fetchData = async () => {
  const data = await makeRequest(
    () => mapsApi.getIncidents(), 
    {
      onSuccess: (data) => {
        // Traiter les données
      },
      onError: (error) => {
        // Gérer l'erreur
      }
    }
  );
};
*/