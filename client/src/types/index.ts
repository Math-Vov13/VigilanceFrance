import { ApiResponse } from "../services/api";

// User-related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<ApiResponse<User>>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  googleAuth: (token: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  franceConnectAuth: (code: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  isAuthenticated: boolean;
}

// Incident-related types
export interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
}

export type IncidentSeverity = 'mineur' | 'moyen' | 'majeur';

export type IncidentType = 'accident' | 'inondation' | 'vol' | 'agression' | 'incendie' | 'autre';

export interface Incident {
  id: number;
  type: IncidentType;
  title: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  severity: IncidentSeverity;
  reportedBy: string;
  comments: Comment[];
  images?: string[];
}

// Map component props
export interface IncidentMapProps {
  incidents: Incident[];
  onMarkerClick: (incident: Incident) => void;
  filteredType?: string;
  isLoading?: boolean;
}

export interface IncidentSidebarProps {
  incident: Incident;
  onClose: () => void;
  onAddComment?: (comment: string) => void;
}

export interface IncidentFiltersProps {
  selectedType: string;
  onChange: (value: string) => void;
}

// Form types for validation
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface FormErrors {
  login: {
    email: string;
    password: string;
  };
  register: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: string;
  };
}

// Notification types
export interface Notification {
  id: number;
  type: 'incident_near' | 'comment_added' | 'incident_update' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedId?: number; // ID of the related incident or comment
}