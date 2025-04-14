import axios from 'axios';

// Base URL for admin API endpoints
const API_URL = 'http://localhost:3000/api/v1/admin';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type IncidentStatus = 'pending' | 'approved' | 'flagged' | 'deleted';
export type IncidentSeverity = 'mineur' | 'moyen' | 'majeur';
export type IncidentType = 'accident' | 'inondation' | 'vol' | 'agression' | 'incendie' | 'autre';

export interface Comment {
  id: number;
  text: string;
  user: {
    id: string;
    name: string;
    status: string;
  };
  date: string;
  status: 'approved' | 'pending' | 'flagged';
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  reportedBy: {
    id: string;
    name: string;
    status: string;
  };
  comments: Comment[];
  images: string[];
  reports: number;
}

export interface IncidentFilters {
  type?: IncidentType;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface IncidentStats {
  // Define the properties of the incident stats response
  totalIncidents: number;
  openIncidents: number;
  closedIncidents: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface WarningData {
  message: string;
  sendNotification: boolean;
}

/**
 * Incident management service for admins
 */
export const incidentService = {
  /**
   * Get all incidents with optional filtering
   */
  getIncidents: async (filters?: IncidentFilters): Promise<PaginatedResponse<Incident>> => {
    try {
      const response = await adminApi.get('/incidents', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  },

  /**
   * Get a single incident by ID with full details
   */
  getIncidentById: async (id: number): Promise<Incident> => {
    try {
      const response = await adminApi.get(`/incidents/${id}`);
      return response.data.incident;
    } catch (error) {
      console.error(`Error fetching incident ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update incident status
   */
  updateIncidentStatus: async (id: number, status: IncidentStatus): Promise<Incident> => {
    try {
      const response = await adminApi.patch(`/incidents/${id}/status`, { status });
      return response.data.incident;
    } catch (error) {
      console.error(`Error updating incident ${id} status:`, error);
      throw error;
    }
  },

  /**
   * Add a warning to an incident
   */
  addWarning: async (id: number, warningData: WarningData): Promise<Incident> => {
    try {
      const response = await adminApi.post(`/incidents/${id}/warning`, warningData);
      return response.data.incident;
    } catch (error) {
      console.error(`Error adding warning to incident ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an incident
   */
  deleteIncident: async (id: number): Promise<void> => {
    try {
      await adminApi.delete(`/incidents/${id}`);
    } catch (error) {
      console.error(`Error deleting incident ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add admin comment to an incident
   */
  addAdminComment: async (id: number, text: string): Promise<Comment> => {
    try {
      const response = await adminApi.post(`/incidents/${id}/comments`, { text, isAdmin: true });
      return response.data.comment;
    } catch (error) {
      console.error(`Error adding comment to incident ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get incident statistics
   */
  getIncidentStats: async (): Promise<IncidentStats> => {
    try {
      const response = await adminApi.get('/incidents/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching incident statistics:', error);
      throw error;
    }
  }
};

export default incidentService;