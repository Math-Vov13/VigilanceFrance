export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
}
  
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
  
  export type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  };

  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
  }