import { Request, Response } from 'express';
import { IUser } from '../models/user.model';

export type AuthUser = IUser;

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