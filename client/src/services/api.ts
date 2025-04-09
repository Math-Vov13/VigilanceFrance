import { User } from '@/types';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';


const API_GATEWAY_URL = process.env.API_GATEWAY_URL ?? 'http://localhost:3000';
const API_TIMEOUT = 15000;


export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

// Créer une instance avec Axios
const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    // Le token d'authentification sera stocké dans les cookies côté gateway
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken && config.url?.includes('/auth/refresh')) {
      config.headers['X-Refresh-Token'] = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401) {
      // Try to refresh the token
      const refreshToken = localStorage.getItem('refresh_token');
      const originalRequest = error.config as AxiosRequestConfig;
      
      if (refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
        try {
          // Call token refresh endpoint
          await apiClient.post('/auth/refresh');
          
          // Original request should now work with the new auth cookie
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token or refresh failed
        localStorage.removeItem('refresh_token');
      }
    }
    const errorMessage = (error.response?.data as ApiResponse)?.message || 'Une erreur est survenue';
    const enhancedError = new Error(errorMessage);
    return Promise.reject(enhancedError);
  }
);

export const authApi = {
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<{ user: User; refreshToken: string }>>> => {
    return apiClient.post('/auth/login', { email, password });
  },
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<ApiResponse<{ user: User; refreshToken: string }>>> => {
    return apiClient.post('/auth/register', userData);
  },
  
  logout: (): Promise<AxiosResponse<ApiResponse<null>>> => {
    return apiClient.post('/auth/logout');
  },
  
  refreshToken: (): Promise<AxiosResponse<ApiResponse<{ refreshToken: string }>>> => {
    return apiClient.post('/auth/refresh');
  },
  
  verifyToken: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> => {
    return apiClient.get('/auth/verify');
  },
  
  
  googleAuth: (token: string): Promise<AxiosResponse<ApiResponse<{ user: User; refreshToken: string }>>> => {
    return apiClient.post('/auth/google', { token });
  },
  
  franceConnectAuth: (code: string): Promise<AxiosResponse<ApiResponse<{ user: User; refreshToken: string }>>> => {
    return apiClient.post('/auth/france-connect', { code });
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