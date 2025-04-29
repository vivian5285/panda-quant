import { Request } from 'express';
import { User } from './user';

export interface AuthRequest extends Request {
  user?: User;
}

export interface User {
  id: string;
  _id: string;
  role: string;
  permissions: string[];
  [key: string]: any;
} 