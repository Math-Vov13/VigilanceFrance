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

// Types for admin auth
export interface AdminCredentials {
  adminId: string;
  secretCode: string;
}

export interface OtpVerification {
  otpCode: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  permissions: string[];
  lastLogin: string;
}

export interface AuthResponse {
  user: AdminUser;
  token: string;
}

/**
 * Admin authentication service
 */
export const adminAuthService = {
  /**
   * Step 1: Login with admin credentials
   * Returns a temporary token to be used for OTP verification
   */
  login: async (credentials: AdminCredentials): Promise<{ tempToken: string }> => {
    try {
      const response = await adminApi.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  /**
   * Step 2: Verify OTP
   * Completes the 2FA process and returns user data with JWT token
   */
  verifyOtp: async (otpData: OtpVerification, tempToken: string): Promise<AuthResponse> => {
    try {
      const response = await adminApi.post('/auth/verify-otp', otpData, {
        headers: {
          'Authorization': `Bearer ${tempToken}` // Use temporary token for verification
        }
      });
      
      // Save the full admin token to localStorage
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_authenticated', 'true');
      }
      
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  /**
   * Get current admin user's profile
   */
  getCurrentAdmin: async (): Promise<AdminUser> => {
    try {
      const response = await adminApi.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  },

  /**
   * Logout the current admin
   */
  logout: async (): Promise<void> => {
    try {
      await adminApi.post('/auth/logout');
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      // Always clear local storage even if API call fails
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_authenticated');
    }
  },

  /**
   * Check if admin token is valid
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      await adminApi.get('/auth/verify');
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_authenticated');
      return false;
    }
  },

  /**
   * Helper to check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem('admin_authenticated') === 'true';
  }
};

export default adminAuthService;