import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { IUser } from '@shared/models/user';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = decoded as IUser;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}; 