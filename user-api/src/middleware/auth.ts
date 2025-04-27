import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { IUser } from '../models/User';

interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as 'user' | 'admin'
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}; 