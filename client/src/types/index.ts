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
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<ApiResponse<User>>;
  logout: () => Promise<void>;
  googleAuth: (token: string) => Promise<ApiResponse<User>>;
  franceConnectAuth: (code: string) => Promise<ApiResponse<User>>;
  refreshAuthToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Comment {
  id: string;
  text: string;
  user: string; 
  firstName?: string;
  lastName?: string; 
  date: string;
  likes?: number;
  reported?: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
export interface Incident {
  id: string;
  type: IncidentType;              
  title: string;             
  description: string;        
  location: string;           
  coordinates: Coordinates;               
  status?: IncidentStatus;
  severity: IncidentSeverity;                
  upvotes?: number;                 
  comments: Comment[];        
  imageUrls?: string[];      
}


export type IncidentType = 
  | 'accident'
  | 'inondation'
  | 'incendie'
  | 'vol'
  | 'agression'
  | 'manifestation'
  | 'panne'
  | 'pollution'
  | 'autre';

export type IncidentSeverity = 
  | 'mineur'
  | 'moyen'
  | 'majeur'
  | 'critique';

export type IncidentStatus = 
  | 'active'
  | 'verified'
  | 'resolved'
  | 'unverified';

export interface IncidentTypeInfo {
  value: IncidentType;
  label: string;
  color: string;
  icon: string;
}

export interface SeverityLevel {
  value: IncidentSeverity;
  label: string;
  color: string;
}

export interface IncidentStatusInfo {
  value: IncidentStatus;
  label: string;
  color: string;
}

export interface SocketMessage {
  _id: string;
  issue_id: string;
  user_id: string;
  firstName: string;
  lastName: string;
  message: string;
  created_at: string;
  likes?: number;
  reported?: boolean;
}

export interface MessagesDocument {
  connected: boolean;
  id: string;
  length: number;
  messages: SocketMessage[];
}