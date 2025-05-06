import { Request, Response } from 'express';
import { IUser } from '../models/user.model';

export interface AuthUser extends IUser {
  id: string;
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