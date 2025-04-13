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

// Types
export type CommentStatus = 'pending' | 'approved' | 'flagged' | 'deleted';

export interface Comment {
  id: number;
  text: string;
  user: {
    id: string;
    name: string;
    status: string;
  };
  incident: {
    id: number;
    title: string;
    type: string;
  };
  date: string;
  status: CommentStatus;
  reports: number;
}

export interface CommentFilters {
  status?: CommentStatus;
  incidentId?: number;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

/**
 * Comment moderation service for admins
 */
export const commentService = {
  /**
   * Get all comments with optional filtering
   */
  getComments: async (filters?: CommentFilters): Promise<PaginatedResponse<Comment>> => {
    try {
      const response = await adminApi.get('/comments', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  /**
   * Get a single comment by ID
   */
  getCommentById: async (id: number): Promise<Comment> => {
    try {
      const response = await adminApi.get(`/comments/${id}`);
      return response.data.comment;
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Approve a comment
   */
  approveComment: async (id: number): Promise<Comment> => {
    try {
      const response = await adminApi.patch(`/comments/${id}/status`, { status: 'approved' });
      return response.data.comment;
    } catch (error) {
      console.error(`Error approving comment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Flag a comment as inappropriate
   */
  flagComment: async (id: number): Promise<Comment> => {
    try {
      const response = await adminApi.patch(`/comments/${id}/status`, { status: 'flagged' });
      return response.data.comment;
    } catch (error) {
      console.error(`Error flagging comment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a comment
   */
  deleteComment: async (id: number): Promise<void> => {
    try {
      await adminApi.delete(`/comments/${id}`);
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reply to a comment as admin
   */
  replyToComment: async (id: number, text: string): Promise<Comment> => {
    try {
      const response = await adminApi.post(`/comments/${id}/reply`, { text });
      return response.data.comment;
    } catch (error) {
      console.error(`Error replying to comment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get comment stats
   */
  getCommentStats: async (): Promise<any> => {
    try {
      const response = await adminApi.get('/comments/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching comment statistics:', error);
      throw error;
    }
  },

  /**
   * Find user comments by user ID
   */
  getUserComments: async (userId: string): Promise<Comment[]> => {
    try {
      const response = await adminApi.get(`/users/${userId}/comments`);
      return response.data.comments;
    } catch (error) {
      console.error(`Error fetching comments for user ${userId}:`, error);
      throw error;
    }
  }
};

export default commentService;