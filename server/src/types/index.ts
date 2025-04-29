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

export * from './user';
export * from './auth';
export * from './commission';
export * from './withdrawal';
export * from './strategy';
export * from './order';
export * from './position';
export * from './alert';
export * from './notification';
export * from './network'; 