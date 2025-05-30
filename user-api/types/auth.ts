import { Request, Response } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface AuthResponse extends Response {
  status(code: number): this;
  json(body: any): this;
} 