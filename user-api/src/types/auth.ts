import { AuthRequest, AuthResponse, AuthNextFunction } from './express';

export interface IUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  hostingFee: number;
  subscriptionFee: number;
  accountBalance: number;
  subscriptionEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthMiddleware {
  (req: AuthRequest, res: AuthResponse, next: AuthNextFunction): void;
} 