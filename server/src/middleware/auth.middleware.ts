import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types/Auth';
import { IUserDocument } from '../models/User';
import User from '../models/User';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key') as { id: string; email: string };
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(403).json({ message: 'User not found' });
      return;
    }

    const authReq = req as unknown as AuthenticatedRequest;
    authReq.user = user;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
}; 