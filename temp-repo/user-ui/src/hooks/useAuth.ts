import { useState, useEffect, useCallback } from 'react';
import { AuthState, User } from '../types/auth';
import web3Service from '../services/web3';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../contexts/Web3Context';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { connect } = useWeb3();

  useEffect(() => {
    // Check local storage for existing auth data on mount
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(user),
        token,
      });
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement email login logic
      navigate('/dashboard');
    } catch (err) {
      setError(t('login.error'));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate, t]);

  const loginWithWallet = useCallback(async (walletType: string) => {
    try {
      setLoading(true);
      setError(null);
      await connect(walletType);
      navigate('/dashboard');
    } catch (err) {
      setError(t('wallet.error'));
      console.error('Wallet login error:', err);
    } finally {
      setLoading(false);
    }
  }, [connect, navigate, t]);

  const logout = useCallback(() => {
    web3Service.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    navigate('/login');
  }, [navigate]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement registration logic
      navigate('/dashboard');
    } catch (err) {
      setError(t('register.error'));
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate, t]);

  const updateUsername = useCallback(async (username: string) => {
    try {
      const response = await fetch('/api/auth/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Username update failed');
      }

      if (!authState.user) {
        throw new Error('No user found');
      }

      const updatedUser: User = {
        id: authState.user.id,
        email: authState.user.email,
        username,
        role: authState.user.role,
        createdAt: authState.user.createdAt,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return true;
    } catch (error) {
      console.error('Username update error:', error);
      return false;
    }
  }, [authState.token, authState.user]);

  return {
    ...authState,
    loading,
    error,
    loginWithEmail,
    loginWithWallet,
    logout,
    register,
    updateUsername,
  };
}; 