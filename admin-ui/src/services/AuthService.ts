import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      return userData.user;
    }
    return null;
  }

  getToken(): string | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      return userData.token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export default new AuthService(); 