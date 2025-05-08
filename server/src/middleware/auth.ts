import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { User, IUserDocument } from '../models/user.model';
import { logger } from '../utils/logger';
import { IUser } from '../types/User';

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export const ensureAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    if (!decoded) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = { _id: decoded.id } as any;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const authorize = (role: string) => async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  } catch (error) {
    logger.error('Authorization error:', error);
    res.status(403).json({ error: 'Authorization failed' });
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
    if (!req.user || !req.user.permissions?.includes(permission)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as IUserDocument;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Error authenticating token:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}; 