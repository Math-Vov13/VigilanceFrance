// api.ts
import axios, { AxiosError, AxiosRequestConfig} from 'axios';
import { User } from '@/types';
import { tokenService } from './tokenService';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:3000';
const API_TIMEOUT = 15000;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/auth/refresh')) {
    const token = tokenService.getRefreshToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;
    const refreshToken = tokenService.getRefreshToken();

    if (error.response?.status === 401 && refreshToken && !originalRequest.url?.includes('/auth/auth/refresh')) {
      try {
        await apiClient.post('/auth/auth/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenService.clearRefreshToken();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    } else {
      tokenService.clearRefreshToken();
    }

    const message = (error.response?.data as ApiResponse)?.message ?? 'Une erreur est survenue';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (email: string, password: string) => apiClient.post('/auth/auth/login', { email, password }),
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => apiClient.post('/auth/auth/register', data),
  logout: () => apiClient.post('/auth/auth/logout'),
  verifyToken: () => apiClient.get<ApiResponse<User>>('/auth/account/profile'),
  refreshToken: () => apiClient.post('/auth/auth/refresh'),
  googleAuth: (token: string) => apiClient.post('/auth/auth/google', { token }),
  franceConnectAuth: (code: string) => apiClient.post('/auth/auth/france-connect', { code })
};

export const mapsApi = {
  getIncidents: (filters?: { type?: string; severity?: string; startDate?: string; endDate?: string; location?: string }) => apiClient.get('/maps/incidents', { params: filters }),
  getIncidentById: (id: string | number) => apiClient.get(`/maps/incidents/${id}`),
  createIncident: (data: User) => apiClient.post('/maps/incidents', data),
  updateIncident: (id: string | number, data: User) => apiClient.put(`/maps/incidents/${id}`, data),
  addComment: (id: string | number, text: string) => apiClient.post(`/maps/incidents/${id}/comments`, { text })
};

export const notifsApi = {
  getNotifications: () => apiClient.get('/notifs/user'),
  markAsRead: (id: string | number) => apiClient.put(`/notifs/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifs/read-all'),
  updatePreferences: (preferences: User) => apiClient.put('/notifs/preferences', preferences)
};

export const messApi = {
  getConversations: () => apiClient.get('/mess/conversations'),
  getMessages: (conversationId: string | number) => apiClient.get(`/mess/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string | number, content: string) => apiClient.post(`/mess/conversations/${conversationId}/messages`, { content }),
  createConversation: (participants: string[], title?: string) => apiClient.post('/mess/conversations', { participants, title })
};

export default { auth: authApi, maps: mapsApi, notifs: notifsApi, mess: messApi };
