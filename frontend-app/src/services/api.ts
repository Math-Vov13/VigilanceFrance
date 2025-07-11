import { User } from '@/types/user';
import { Incident, IncidentType, IncidentSeverity, IncidentStatus } from '@/types';


const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  content?: T;
}




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
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_GATEWAY_URL}/auth/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  register: async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await fetch(`${API_GATEWAY_URL}/auth/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  logout: async () => {
    const response = await fetch(`${API_GATEWAY_URL}/auth/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },
  verifyToken: async () => {
    const response = await fetch(`${API_GATEWAY_URL}/auth/account/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    return response.json();
  },
  refreshToken: async () => {
    const response = await fetch(`${API_GATEWAY_URL}/auth/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },
  googleAuth: async (token: string) => {
    const response = await fetch(`${API_GATEWAY_URL}/auth/auth/google`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return response.json();
  },
  franceConnectAuth: async (code: string) => {
    const response = await fetch(`${API_GATEWAY_URL}/auth/auth/france-connect`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return response.json();
  }
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
      
      const response = await fetch(`${API_GATEWAY_URL}${url}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return extractIncidentData(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  },
  
  getIncidentById: async (id: string | number) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/issues/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return extractData<Incident>(data);
    } catch (error) {
      console.error(`Error fetching incident ${id}:`, error);
      throw error;
    }
  },
  
  createIncident: async (newIncident: Omit<Incident, 'id' | 'comments'>): Promise<Incident> => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/issues/create`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncident),
      });
      const data = await response.json();
      let createdIncident;
      if (data.issue) {
        createdIncident = data.issue;
      } else if (data.data) {
        createdIncident = data.data;
      } else {
        createdIncident = data;
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
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/issues/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      return extractData<Incident>(resData);
    } catch (error) {
      console.error(`Error updating incident ${id}:`, error);
      throw error;
    }
  },
  
  // Commentaires
  addComment: async (id: string, text: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/issues/${id}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const resData = await response.json();
      return extractData<{ id: number; date: string }>(resData);
    } catch (error) {
      console.error(`Error adding comment to incident ${id}:`, error);
      throw error;
    }
  },
  
  likeComment: async (incidentId: string, commentId: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/issues/${incidentId}/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await response.json();
      return extractData<{ likes: number }>(resData);
    } catch (error) {
      console.error(`Error liking comment ${commentId}:`, error);
      throw error;
    }
  },
  
  reportComment: async (incidentId: string, commentId: string, reason?: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/issues/${incidentId}/comments/${commentId}/report`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const resData = await response.json();
      return extractData<{ reported: boolean }>(resData);
    } catch (error) {
      console.error(`Error reporting comment ${commentId}:`, error);
      throw error;
    }
  },
  
  // Votes sur les incidents
  getVotes: async (incidentId: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/votes/upvotes?issue_id=${incidentId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await response.json();
      return extractData<{ upvotes: number; downvotes: number; userVoted: boolean }>(resData);
    } catch (error) {
      console.error(`Error getting votes for incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  addVote: async (incidentId: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/votes/vote?issue_id=${incidentId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await response.json();
      return extractData<{ vote_id: string }>(resData);
    } catch (error) {
      console.error(`Error adding vote to incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  removeVote: async (incidentId: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/votes/vote?issue_id=${incidentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await response.json();
      return extractData<string>(resData);
    } catch (error) {
      console.error(`Error removing vote from incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  // Marquer un incident comme résolu
  getSolvedVotes: async (incidentId: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/solved/upvote?issue_id=${incidentId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await response.json();
      return extractData<{ votes: number; voted: boolean }>(resData);
    } catch (error) {
      console.error(`Error getting solved votes for incident ${incidentId}:`, error);
      throw error;
    }
  },
  
  markAsSolved: async (incidentId: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/solved/vote?issue_id=${incidentId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await response.json();
      return extractData<{ solved: boolean; vote_id: string }>(resData);
    } catch (error) {
      console.error(`Error marking incident ${incidentId} as solved:`, error);
      throw error;
    }
  },
  
  unmarkAsSolved: async (incidentId: string) => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/maps/interactions/solved/vote?issue_id=${incidentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const resData = await response.json();
      return extractData<string>(resData);
    } catch (error) {
      console.error(`Error unmarking incident ${incidentId} as solved:`, error);
      throw error;
    }
  }
};

export const notifsApi = {
  getNotifications: async () => {
    const response = await fetch(`${API_GATEWAY_URL}/notifs/user`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },
  markAsRead: async (id: string | number) => {
    const response = await fetch(`${API_GATEWAY_URL}/notifs/${id}/read`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },
  markAllAsRead: async () => {
    const response = await fetch(`${API_GATEWAY_URL}/notifs/read-all`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },
  updatePreferences: async (preferences: User) => {
    const response = await fetch(`${API_GATEWAY_URL}/notifs/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    return response.json();
  }
};

export const messApi = {
  getConversations: async () => {
    const response = await fetch(`${API_GATEWAY_URL}/mess/conversations`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },
  getMessages: async (conversationId: string) => {
    const response = await fetch(`${API_GATEWAY_URL}/mess/conversations/${conversationId}/messages`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },
  sendMessage: async (conversationId: string, content: string) => {
    const response = await fetch(`${API_GATEWAY_URL}/mess/conversations/${conversationId}/messages`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },
  createConversation: async (participants: string[], title?: string) => {
    const response = await fetch(`${API_GATEWAY_URL}/mess/conversations`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participants, title }),
    });
    return response.json();
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