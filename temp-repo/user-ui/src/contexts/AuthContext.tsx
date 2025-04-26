import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from './Web3Context';
import { authApi } from '../services/api';

interface User {
  id?: string;
  email?: string;
  address?: string;
  role?: string;
  username?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletType: string) => Promise<void>;
  register: (email: string, password: string, username: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const web3 = useWeb3();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userStr));
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement email login logic with API call
      const mockUser: User = {
        id: '1',
        email,
        role: 'user',
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsAuthenticated(true);
      setUser(mockUser);
    } catch (err) {
      setError(t('auth.loginError'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loginWithWallet = useCallback(async (walletType: string) => {
    try {
      setLoading(true);
      setError(null);
      await web3.connect(walletType);
      const address = await web3.getAddress();
      const mockUser: User = {
        id: '2',
        address,
        role: 'user',
        username: `${address.slice(0, 6)}...${address.slice(-4)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsAuthenticated(true);
      setUser(mockUser);
    } catch (err) {
      setError(t('auth.walletLoginError'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [web3, t]);

  const register = useCallback(async (email: string, password: string, username: string, code: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register(email, password, username, code);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || t('auth.registerError');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [t]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement logout logic with API call
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      setError(t('auth.logoutError'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [t]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loginWithEmail,
    loginWithWallet,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 