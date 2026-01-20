import axios from 'axios';
import { User, Incident, IncidentType, IncidentSeverity, IncidentStatus } from '@/types';
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
  // Add refresh token header for endpoints that require it
  const requiresRefreshToken = [
    '/auth/auth/refresh',
    '/auth/auth/logout'
  ];
  
  const needsToken = requiresRefreshToken.some(endpoint => 
    config.url?.includes(endpoint)
  );
  
  if (needsToken) {
    const token = tokenService.getRefreshToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('No refresh token available'));
    }
  }
  return config;
}, Promise.reject);

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // Don't retry if it's the refresh endpoint itself
    if (originalRequest.url?.includes('/auth/auth/refresh')) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          console.log('No refresh token available for retry');
          throw new Error('No refresh token');
        }

        console.log('Attempting to refresh token for failed request');
        
        // Use a separate axios instance to avoid triggering the interceptor again
        const response = await axios.post(
          `${API_GATEWAY_URL}/auth/auth/refresh`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          }
        );

        if (response.status === 200) {
          console.log('Token refreshed, retrying original request');
          // Wait briefly for cookie to be set
          await new Promise(resolve => setTimeout(resolve, 100));
          // Retry the original request with the new access token cookie
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        tokenService.clearRefreshToken();
        // Redirect to login or dispatch a logout action
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Function to validate coordinates
const validateCoordinates = (
  coords: any, 
  fallback = { lat: 0, lng: 0 }
): { lat: number; lng: number } => {
  if (!coords || typeof coords !== 'object') return fallback;
  
  const lat = typeof coords.lat === 'number' ? coords.lat : parseFloat(coords.lat);
  const lng = typeof coords.lng === 'number' ? coords.lng : parseFloat(coords.lng);
  
  if (isNaN(lat) || isNaN(lng)) return fallback;
  
  return { lat, lng };
};

// Transform incident data from API response
const extractIncidentData = (data: any): Incident[] => {
  if (!data || !data.content || !Array.isArray(data.content)) return [];

  return data.content.map((item: any) => {
    // Ensure coordinates is always a valid object with lat and lng
    const coordinates = validateCoordinates(item.coordinates);
    
    return {
      id: item._id || item.id || `temp-${Date.now()}`,
      type: item.type as IncidentType || 'other',
      title: item.title || 'Incident sans titre',
      description: item.description || '',
      location: item.location || 'Emplacement inconnu',
      coordinates,
      date: item.created_at || new Date().toISOString(),
      status: (item.solved?.length ? 'resolved' : 'active') as IncidentStatus,
      severity: item.severity as IncidentSeverity || 'moyen',
      upvotes: item.votes?.length || 0,
      downvotes: 0, 
      comments: Array.isArray(item.comments) ? item.comments : [], 
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : [],
    };
  });
};

export const authApi = {
  login: (email: string, password: string) => apiClient.post('/auth/auth/login', { email, password }),
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => apiClient.post('/auth/auth/register', data),
  logout: () => apiClient.post('/auth/auth/logout'),
  verifyToken: () => apiClient.get<ApiResponse<User>>('/auth/account/profile'),
  refreshToken: () => apiClient.post('/auth/auth/refresh'),
  googleAuth: (code: string) => apiClient.post('/auth/auth/google', { code }),
  githubAuth: (code: string) => apiClient.post('/auth/auth/github', { code }),
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
  getIncidents: async (typeFilter = '') => {
    try {
      const url = typeFilter && typeFilter !== 'all' 
        ? `/maps/interactions/issues/show?type=${typeFilter}`
        : `/maps/interactions/issues/show`;
      
      const response = await apiClient.get(url);
      return extractIncidentData(response.data);
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
  
  createIncident: async (newIncident: Omit<Incident, 'id' | 'comments'>): Promise<Incident> => {
    try {
      const response = await apiClient.post('/maps/interactions/issues/create', newIncident);
      
      let createdIncident;
      if (response.data?.issue) {
        createdIncident = response.data.issue;
      } else if (response.data?.data) {
        createdIncident = response.data.data;
      } else {
        createdIncident = response.data;
      }
      
      const type = createdIncident.type as IncidentType;
      const severity = createdIncident.severity as IncidentSeverity;
      const status = createdIncident.status as IncidentStatus;
      const coordinates = validateCoordinates(
        createdIncident.coordinates,
        validateCoordinates(newIncident.coordinates)
      );
      
      return {
        id: createdIncident._id,
        type,
        title: createdIncident.title,
        description: createdIncident.description,
        location: createdIncident.location,
        coordinates,
        status,
        severity,
        upvotes: createdIncident.votes?.length,
        comments: createdIncident.comments || [],
        imageUrls: createdIncident.imageUrls || [],
      };
    } catch (error) {
      console.error('Failed to create incident:', error);
      throw error;
    }
  },
  
  updateIncident: async (id: string, data: Partial<Incident>) => {
    try {
      const response = await apiClient.put(`/maps/interactions/issues/${id}`, data);
      return extractData<Incident>(response);
    } catch (error) {
      console.error(`Error updating incident ${id}:`, error);
      throw error;
    }
  },

  deleteIncident: async (id: string) => {
    try {
      const response = await apiClient.delete(`/maps/interactions/issues/${id}`);
      return extractData<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error(`Error deleting incident ${id}:`, error);
      throw error;
    }
  },
  
  // Commentaires
  addComment: async (id: string, text: string) => {
    try {
      const response = await apiClient.post(`/maps/interactions/issues/${id}/comments`, { text });
      return extractData<{ id: number; date: string }>(response);
    } catch (error) {
      console.error(`Error adding comment to incident ${id}:`, error);
      throw error;
    }
  },
  
  likeComment: async (incidentId: string, commentId: string) => {
    try {
      const response = await apiClient.post(`/maps/interactions/issues/${incidentId}/comments/${commentId}/like`);
      return extractData<{ likes: number }>(response);
    } catch (error) {
      console.error(`Error liking comment ${commentId}:`, error);
      throw error;
    }
  },
  
  reportComment: async (incidentId: string, commentId: string, reason?: string) => {
    try {
      const response = await apiClient.post(`/maps/interactions/issues/${incidentId}/comments/${commentId}/report`, { reason });
      return extractData<{ reported: boolean }>(response);
    } catch (error) {
      console.error(`Error reporting comment ${commentId}:`, error);
      throw error;
    }
  },
  
  // Votes sur les incidents
  getVotes: async (incidentId: string) => {
    try {
      const response = await apiClient.get(`/maps/interactions/votes/upvotes?issue_id=${incidentId}`);
      return extractData<{ upvotes: number; downvotes: number; userVoted: boolean }>(response);
    } catch (error) {
      console.error(`Error getting votes for incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  addVote: async (incidentId: string) => {
    try {
      const response = await apiClient.post(`/maps/interactions/votes/vote?issue_id=${incidentId}`);
      return extractData<{ vote_id: string }>(response);
    } catch (error) {
      console.error(`Error adding vote to incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  removeVote: async (incidentId: string) => {
    try {
      const response = await apiClient.delete(`/maps/interactions/votes/vote?issue_id=${incidentId}`);
      return extractData<string>(response);
    } catch (error) {
      console.error(`Error removing vote from incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  // Marquer un incident comme résolu
  getSolvedVotes: async (incidentId: string) => {
    try {
      const response = await apiClient.get(`/maps/interactions/solved/upvote?issue_id=${incidentId}`);
      return extractData<{ votes: number; voted: boolean }>(response);
    } catch (error) {
      console.error(`Error getting solved votes for incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  markAsSolved: async (incidentId: string) => {
    try {
      const response = await apiClient.post(`/maps/interactions/solved/vote?issue_id=${incidentId}`);
      return extractData<{ solved: boolean; vote_id: string }>(response);
    } catch (error) {
      console.error(`Error marking incident ${incidentId} as solved:`, error);
      throw error;
    }
  },
  
  unmarkAsSolved: async (incidentId: string) => {
    try {
      const response = await apiClient.delete(`/maps/interactions/solved/vote?issue_id=${incidentId}`);
      return extractData<string>(response);
    } catch (error) {
      console.error(`Error unmarking incident ${incidentId} as solved:`, error);
      throw error;
    }
  }
};

export const notifsApi = {
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/notifs/user');
      return extractData<any[]>(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/notifs/unread-count');
      return extractData<number>(response);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },
  markAsRead: async (id: string | number) => {
    try {
      const response = await apiClient.put(`/notifs/${id}/read`);
      return extractData<any>(response);
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put('/notifs/read-all');
      return extractData<any>(response);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
  updatePreferences: async (preferences: User) => {
    try {
      const response = await apiClient.put('/notifs/preferences', preferences);
      return extractData<any>(response);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }
};

export const messApi = {
  getConversations: async () => {
    try {
      const response = await apiClient.get('/mess/conversations');
      return extractData<any[]>(response);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },
  getMessages: async (conversationId: string) => {
    try {
      const response = await apiClient.get(`/mess/conversations/${conversationId}/messages`);
      return extractData<any[]>(response);
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      throw error;
    }
  },
  sendMessage: async (conversationId: string, content: string) => {
    try {
      const response = await apiClient.post(`/mess/conversations/${conversationId}/messages`, { content });
      return extractData<any>(response);
    } catch (error) {
      console.error(`Error sending message in conversation ${conversationId}:`, error);
      throw error;
    }
  },
  createConversation: async (participants: string[], title?: string) => {
    try {
      const response = await apiClient.post('/mess/conversations', { participants, title });
      return extractData<any>(response);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
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