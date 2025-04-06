import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // This would be replaced with an actual API call
    console.log('Logging in with:', email, password);
    
    // Mock successful login
    setUser({
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: email,
      profileImage: '/path/to/profile.jpg'
    });
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    // This would be replaced with an actual API call
    console.log('Registering user:', userData);
    
    // Mock successful registration
    setUser({
      id: '1',
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      profileImage: userData.profileImage
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};