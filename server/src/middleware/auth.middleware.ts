import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types/auth';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key') as { id: string; email: string };
    (req as AuthenticatedRequest).user = { _id: decoded.id, email: decoded.email } as any;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
}; 