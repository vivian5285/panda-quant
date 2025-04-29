import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  permissions?: string[];
  referrerId?: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
} 