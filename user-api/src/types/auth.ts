import { AuthRequest, AuthResponse, AuthNextFunction } from './express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthMiddleware {
  (req: AuthRequest, res: AuthResponse, next: AuthNextFunction): void;
} 