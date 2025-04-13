import { User } from './index';

export interface AdminUser extends User {
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  lastLogin?: string;
  status?: {
    active: boolean;
    suspended: boolean;
    banned: boolean;
  };
  reportedIncidents?: number[];
  savedIncidents?: number[];
}

export interface AdminAuthContextType {
    admin: AdminUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }