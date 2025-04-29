import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user';

export interface AuthRequest extends Request {
  user?: User;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export const requireModerator = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.permissions.includes('moderator')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.permissions.includes('admin')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export const authorize = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.permissions.includes('user')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}; 