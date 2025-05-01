import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser } from '../types/user';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Convert Mongoose document to plain object and ensure _id is ObjectId
    const userObject = user.toObject();
    const userId = user._id as Types.ObjectId;
    req.user = {
      ...userObject,
      _id: userId,
      id: userId.toString(),
      isAdmin: userObject.role === 'admin'
    } as IUser;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Not authorized' });
    return;
  }

  next();
};

export const hasPermission = (permission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
}; 