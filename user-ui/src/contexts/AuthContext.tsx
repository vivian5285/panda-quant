import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from './Web3Context';
import { authApi } from '../services/api';
import { User } from '../types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletType: string) => Promise<void>;
  register: (email: string, password: string, username: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  updateUser: (user: User) => void;
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
        walletAddress: '',
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
      
      const address = await web3.connect(walletType);
      if (!address) {
        throw new Error(t('auth.walletConnectionFailed'));
      }

      const response = await authApi.loginWithWallet(address);
      const { token, user: userData } = response.data;
      
      const user: User = {
        id: userData._id,
        email: userData.email,
        username: userData.username || '',
        walletAddress: address,
        role: userData.role as 'user' | 'admin',
        status: userData.status,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginFailed'));
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
      const { token, user: userData } = response.data;
      
      const user: User = {
        id: userData._id,
        email: userData.email,
        username: userData.username || '',
        walletAddress: userData.walletAddress || '',
        role: userData.role as 'user' | 'admin',
        status: userData.status,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerFailed'));
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

  const updateUser = useCallback((user: User) => {
    setUser(user);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token: localStorage.getItem('token'),
    loginWithEmail,
    loginWithWallet,
    register,
    logout,
    loading,
    error,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 