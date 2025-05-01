import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      navigate('/login');
      return;
    }

    // 验证 token 是否有效
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          localStorage.removeItem('admin_token');
          setIsAuthenticated(false);
          setUser(null);
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('登录失败');
    }

    const data = await response.json();
    localStorage.setItem('admin_token', data.token);
    setIsAuthenticated(true);
    setUser(data.user);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
  };
}; 