import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../Config';
import { UnauthorizedError, ForbiddenError } from '../utils/Errors';
import { User, IUserDocument } from '../models/User.model';
import { logger } from '../utils/Logger';
import { IUser } from '../types/User';

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
  headers: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
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

// 通用的错误处理函数
const handleAuthError = (error: Error, res: Response): void => {
  logger.error('Authentication error:', error);
  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ForbiddenError) {
    res.status(403).json({ error: error.message });
  } else {
    res.status(403).json({ error: 'Authorization failed' });
  }
};

export const ensureAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    if (!decoded) {
      throw new UnauthorizedError('Invalid token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    handleAuthError(error as Error, res);
  }
};

export const authorize = (role: string) => async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (req.user.role !== role) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  } catch (error) {
    handleAuthError(error as Error, res);
  }
};

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized');
    }

    next();
  } catch (error) {
    handleAuthError(error as Error, res);
  }
};

export const hasPermission = (permission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      if (!req.user.permissions?.includes(permission)) {
        throw new ForbiddenError('Access denied');
      }

      next();
    } catch (error) {
      handleAuthError(error as Error, res);
    }
  };
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Authentication token is required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    handleAuthError(error as Error, res);
  }
}; 