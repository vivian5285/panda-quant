import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../utils/errors';
import { AuthRequest, AuthResponse } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

export function authenticate(req: AuthRequest, res: AuthResponse, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ValidationError('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ValidationError('No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'user' | 'admin' };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else if (error instanceof ValidationError) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 