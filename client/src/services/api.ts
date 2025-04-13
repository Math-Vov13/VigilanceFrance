import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { User, Incident } from '@/types';
import { tokenService } from './tokenService';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;
const API_TIMEOUT = 15000;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  content?: T; // Ajout du champ content pour la compatibilité
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
const extractData = <T>(response: any): T => {
  if (response.data?.content) {
    return response.data.content;
  } else if (response.data?.data) {
    return response.data.data;
  } else if (response.data) {
    return response.data;
  }
  return response as T;
};

export const mapsApi = {
  // Récupération des incidents
  getIncidents: async (filters?: { type?: string; severity?: string; startDate?: string; endDate?: string; location?: string }) => {
    try {
      const response = await apiClient.get('/maps/interactions/issues/show', { params: filters });
      return extractData<Incident[]>(response);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  },
  
  getIncidentById: async (id: string | number) => {
    try {
      const response = await apiClient.get(`/maps/interactions/issues/${id}`);
      return extractData<Incident>(response);
    } catch (error) {
      console.error(`Error fetching incident ${id}:`, error);
      throw error;
    }
  },
  
  createIncident: async (data: Omit<Incident, 'id' | 'comments'>) => {
    try {
      const response = await apiClient.post('/maps/interactions/issues/create', data);
      return extractData<Incident>(response);
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  },
  
  updateIncident: async (id: string | number, data: Partial<Incident>) => {
    try {
      const response = await apiClient.put(`/maps/interactions/issues/${id}`, data);
      return extractData<Incident>(response);
    } catch (error) {
      console.error(`Error updating incident ${id}:`, error);
      throw error;
    }
  },
  
  // Commentaires
  addComment: async (id: string | number, text: string, username: string) => {
    try {
      const response = await apiClient.post(`/maps/interactions/issues/${id}/comments`, { text, username });
      return extractData<{ id: number; date: string }>(response);
    } catch (error) {
      console.error(`Error adding comment to incident ${id}:`, error);
      throw error;
    }
  },
  
  likeComment: async (incidentId: string | number, commentId: number) => {
    try {
      const response = await apiClient.post(`/maps/interactions/issues/${incidentId}/comments/${commentId}/like`);
      return extractData<{ likes: number }>(response);
    } catch (error) {
      console.error(`Error liking comment ${commentId}:`, error);
      throw error;
    }
  },
  
  reportComment: async (incidentId: string | number, commentId: number, reason?: string) => {
    try {
      const response = await apiClient.post(`/maps/interactions/issues/${incidentId}/comments/${commentId}/report`, { reason });
      return extractData<{ reported: boolean }>(response);
    } catch (error) {
      console.error(`Error reporting comment ${commentId}:`, error);
      throw error;
    }
  },
  
  // Votes sur les incidents
  getVotes: async (incidentId: string | number) => {
    try {
      const response = await apiClient.get(`/maps/interactions/votes/upvotes?issue_id=${incidentId}`);
      return extractData<{ upvotes: number; downvotes: number; userVoted: boolean }>(response);
    } catch (error) {
      console.error(`Error getting votes for incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  addVote: async (incidentId: string | number) => {
    try {
      const response = await apiClient.post(`/maps/interactions/votes/create?issue_id=${incidentId}`);
      return extractData<{ vote_id: string }>(response);
    } catch (error) {
      console.error(`Error adding vote to incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  removeVote: async (incidentId: string | number) => {
    try {
      const response = await apiClient.delete(`/maps/interactions/votes?issue_id=${incidentId}`);
      return extractData<string>(response);
    } catch (error) {
      console.error(`Error removing vote from incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  // Marquer un incident comme résolu
  getSolvedVotes: async (incidentId: string | number) => {
    try {
      const response = await apiClient.get(`/maps/interactions/solved/upvotes?issue_id=${incidentId}`);
      return extractData<{ votes: number; voted: boolean }>(response);
    } catch (error) {
      console.error(`Error getting solved votes for incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  markAsSolved: async (incidentId: string | number) => {
    try {
      const response = await apiClient.post(`/maps/interactions/solved/create?issue_id=${incidentId}`);
      return extractData<{ solved: boolean; vote_id: string }>(response);
    } catch (error) {
      console.error(`Error marking incident ${incidentId} as solved:`, error);
      throw error;
    }
  },
  
  unmarkAsSolved: async (incidentId: string | number) => {
    try {
      const response = await apiClient.delete(`/maps/interactions/solved?issue_id=${incidentId}`);
      return extractData<string>(response);
    } catch (error) {
      console.error(`Error unmarking incident ${incidentId} as solved:`, error);
      throw error;
    }
  }
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

// Pour la compatibilité avec le code existant
export const incidentsApi = {
  getAll: mapsApi.getIncidents,
  create: mapsApi.createIncident,
};

export const votesApi = {
  getVotes: mapsApi.getVotes,
  addVote: mapsApi.addVote,
  removeVote: mapsApi.removeVote,
};

export const solvedApi = {
  getSolvedVotes: mapsApi.getSolvedVotes,
  markAsSolved: mapsApi.markAsSolved,
  unmarkAsSolved: mapsApi.unmarkAsSolved,
};

export default { auth: authApi, maps: mapsApi, notifs: notifsApi, mess: messApi, incidents: incidentsApi, votes: votesApi, solved: solvedApi };