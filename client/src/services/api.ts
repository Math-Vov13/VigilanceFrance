import { User } from '@/types';
import axios, { AxiosResponse, AxiosError } from 'axios';


const API_GATEWAY_URL = 'http://localhost:3000/api/v1';
const API_TIMEOUT = 15000;


export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(Error(error));
  }
);


apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      
    }
    
    // Enhance error with more details
    const enhancedError = new Error(
      (error.response?.data as { message?: string })?.message
    );
    return Promise.reject(enhancedError);
  }
);

export const authApi = {
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> => {
    return apiClient.post('/auth/login', { email, password });
  },
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> => {
    return apiClient.post('/auth/register', userData);
  },
  

  logout: (): Promise<AxiosResponse<ApiResponse<null>>> => {
    return apiClient.post('/auth/logout');
  },
  verifyToken: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> => {
    return apiClient.get('/auth/verify');
  },
  
  googleAuth: (token: string): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> => {
    return apiClient.post('/auth/google', { token });
  },
  
  franceConnectAuth: (code: string): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> => {
    return apiClient.post('/auth/france-connect', { code });
  }
};

export default {
  auth: authApi
};