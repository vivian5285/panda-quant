import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsAuthenticated(!!user);
    setIsAdmin(user?.role === 'admin');
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });
    setIsAuthenticated(true);
    setIsAdmin(response.user.role === 'admin');
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
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