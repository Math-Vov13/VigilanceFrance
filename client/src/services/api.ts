import { User } from '@/types';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:3000/';
const API_TIMEOUT = 15000;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

// Types pour les réponses d'authentification
export interface AuthTokenResponse {
  connected: boolean;
  user?: string;
  _rft: string;
}

export interface RefreshTokenResponse {
  connected: boolean;
  _rft: string;
}

export interface SocialAuthResponse {
  user: User;
  refreshToken: string;
}

// Créer une instance avec Axios
const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/auth/auth/refresh')) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        config.headers['Authorization'] = `Bearer ${refreshToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
  
    if (error.response?.status === 401 && !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/auth/refresh')) {
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          originalRequest._retry = true;
          
        
          const response = await apiClient.post('/auth/auth/refresh');
          
         
          if (response.data && response.data._rft) {
            localStorage.setItem('refresh_token', response.data._rft);
          }
          
          
          return apiClient(originalRequest);
        } catch (refreshError) {
        
          localStorage.removeItem('refresh_token');
          
         
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
          
          return Promise.reject(refreshError);
        }
      } else {
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }
    const errorMessage = (error.response?.data as ApiResponse)?.message || 'Une erreur est survenue';
    const enhancedError = new Error(errorMessage);
    return Promise.reject(enhancedError);
  }
);

export const authApi = {
  login: (email: string, password: string): Promise<AxiosResponse<AuthTokenResponse>> => {
    return apiClient.post('/auth/auth/login', { email, password });
  },
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthTokenResponse>> => {
    return apiClient.post('/auth/auth/register', userData);
  },
  
  logout: (): Promise<AxiosResponse<ApiResponse<null>>> => {
    return apiClient.post('/auth/auth/logout');
  },

  verifyToken: (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.get('/auth/account/profile');
  },
  
  refreshToken: (): Promise<AxiosResponse<RefreshTokenResponse>> => {
    return apiClient.post('/auth/auth/refresh');
  },
  
  googleAuth: (token: string): Promise<AxiosResponse<ApiResponse<SocialAuthResponse>>> => {
    return apiClient.post('/auth/auth/google', { token });
  },
  
  franceConnectAuth: (code: string): Promise<AxiosResponse<ApiResponse<SocialAuthResponse>>> => {
    return apiClient.post('/auth/auth/france-connect', { code });
  }
};

export const mapsApi = {
  // Get all incidents
  getIncidents: (filters?: {
    type?: string;
    severity?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
  }): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.get('/maps/incidents', { params: filters });
  },
  
  // Get a specific incident by ID
  getIncidentById: (id: string | number): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.get(`/maps/incidents/${id}`);
  },
  
  // Report a new incident
  createIncident: (data: User): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.post('/maps/incidents', data);
  },
  
  // Update an existing incident
  updateIncident: (id: string | number, data: User): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.put(`/maps/incidents/${id}`, data);
  },
  
  // Add a comment to an incident
  addComment: (incidentId: string | number, text: string): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.post(`/maps/incidents/${incidentId}/comments`, { text });
  }
};

// Notifications API endpoints - using /notifs path from gateway
export const notifsApi = {
  // Get user notifications
  getNotifications: (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.get('/notifs/user');
  },
  
  // Mark notification as read
  markAsRead: (id: string | number): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.put(`/notifs/${id}/read`);
  },
  
  // Mark all notifications as read
  markAllAsRead: (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.put('/notifs/read-all');
  },
  
  // Update notification preferences
  updatePreferences: (preferences: User): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.put('/notifs/preferences', preferences);
  }
};

export const messApi = {
  getConversations: (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.get('/mess/conversations');
  },
  
  // Get messages for a specific conversation
  getMessages: (conversationId: string | number): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.get(`/mess/conversations/${conversationId}/messages`);
  },
  
  sendMessage: (conversationId: string | number, content: string): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.post(`/mess/conversations/${conversationId}/messages`, { content });
  },
  
  // Create a new conversation
  createConversation: (participants: string[], title?: string): Promise<AxiosResponse<ApiResponse<User>>> => {
    return apiClient.post('/mess/conversations', { participants, title });
  }
};

// Export all APIs together
export default {
  auth: authApi,
  maps: mapsApi,
  notifs: notifsApi,
  mess: messApi
};
