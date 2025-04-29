import { Request } from 'express';
import { User } from '../types/user';

export interface AuthRequest extends Request {
  user?: User;
} 