import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the Admin user interface
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  lastLogin?: string;
}

// Define the context shape
interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

// Create a provider component
interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check if the admin is already logged in when the app starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Attempt to get admin from localStorage
        const storedAdmin = localStorage.getItem('admin');
        
        if (storedAdmin) {
          const parsedAdmin = JSON.parse(storedAdmin);
          setAdmin(parsedAdmin);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear potentially corrupted storage
        localStorage.removeItem('admin');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate it
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials (in a real app, this would be handled server-side)
      if (email === 'admin@vigilance.fr' && password === 'admin123') {
        const adminUser: AdminUser = {
          id: '1',
          username: 'Admin',
          email: 'admin@vigilance.fr',
          role: 'admin',
          lastLogin: new Date().toISOString()
        };
        
        // Store admin in state
        setAdmin(adminUser);
        
        // Store in localStorage for persistence
        localStorage.setItem('admin', JSON.stringify(adminUser));
      } else {
        throw new Error('Identifiants invalides');
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to handle in the UI
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };
  
  // Provide the context value
  const value = {
    admin,
    isAuthenticated: !!admin,
    loading,
    login,
    logout
  };
  
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Create a hook for easy access to the context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};