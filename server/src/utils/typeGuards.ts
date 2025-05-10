import { Request } from 'express';
import { IUserDocument } from '../models/user.model';
import { AuthenticatedRequest } from '../types/express';
import { AuthRequest } from '../middleware/authMiddleware';

export function isUser(obj: any): obj is IUserDocument {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string' &&
    typeof obj.isActive === 'boolean' &&
    typeof obj.role === 'string' &&
    ['user', 'admin'].includes(obj.role) &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date &&
    (obj.balance === undefined || typeof obj.balance === 'number') &&
    (obj.accountBalance === undefined || typeof obj.accountBalance === 'number') &&
    (obj.subscriptionFee === undefined || typeof obj.subscriptionFee === 'number') &&
    (obj.username === undefined || typeof obj.username === 'string') &&
    (obj.name === undefined || typeof obj.name === 'string') &&
    (obj.status === undefined || typeof obj.status === 'string') &&
    (obj.level === undefined || typeof obj.level === 'string') &&
    (obj.permissions === undefined || Array.isArray(obj.permissions)) &&
    (obj.resetToken === undefined || typeof obj.resetToken === 'string') &&
    (obj.resetTokenExpires === undefined || obj.resetTokenExpires instanceof Date) &&
    (obj.isAdmin === undefined || typeof obj.isAdmin === 'boolean') &&
    (obj.lastLogin === undefined || obj.lastLogin instanceof Date)
  );
}

export function isAuthenticatedRequest(req: Request): req is AuthRequest {
  return 'user' in req;
} 