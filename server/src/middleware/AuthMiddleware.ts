import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../Config';
import { UnauthorizedError } from '../utils/Errors';
import { User, IUserDocument } from '../models/User.model';
import { logger } from '../utils/Logger';

export interface AuthRequest extends Request {
  user?: IUserDocument;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(error);
  }
}; 