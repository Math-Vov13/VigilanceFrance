import { ApiResponse } from "../services/api";

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
  googleAuth: (token: string) => Promise<ApiResponse<User>>;
  franceConnectAuth: (code: string) => Promise<ApiResponse<User>>;
  refreshAuthToken: () => Promise<boolean>; // New function for token refresh
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
  likes?: number;
  reported?: boolean;
}

export type IncidentSeverity = 'mineur' | 'moyen' | 'majeur';

export type IncidentType = 'accident' | 'inondation' | 'vol' | 'agression' | 'incendie' | 'autre';


export interface Coordinates {
  lat: number;
  lng: number;
}
export interface Incident {
  id: number;
  type: string;
  title: string;
  description: string;
  location: string;
  coordinates: Coordinates;
  date: string;
  severity: IncidentSeverity;
  reportedBy: string;
  comments: Comment[];
  status?: 'active' | 'verified' | 'resolved' | 'unverified';
  imageUrls?: string[];
  verifiedBy?: string;
  verifiedDate?: string;
  upvotes?: number;
  downvotes?: number;
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

export interface Notification {
  id: number;
  type: 'incident_near' | 'comment_added' | 'incident_update' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedId?: number;
}