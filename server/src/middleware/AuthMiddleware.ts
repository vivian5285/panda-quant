import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/Logger';
import { IUser } from '../types/User';

export interface AuthRequest extends Request {
  user?: IUser;
  token?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!req.user.isAdmin) {
      throw new AppError('Admin access required', 403);
    }

    next();
  } catch (error) {
    logger.error('Admin authentication error:', error);
    res.status(403).json({ message: 'Admin access required' });
  }
}; 