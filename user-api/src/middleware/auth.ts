import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { DatabaseError } from '../utils/errors';
import { IUser } from '../models/User';
import { AuthRequest } from '../types/express';

// 定义 AuthUser 类型
export type AuthUser = {
    id: string;
    email: string;
    role: 'user' | 'admin';
};

// 扩展 Express 的 Request 类型
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await User.findById(decoded.id) as IUser | null;
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error instanceof DatabaseError) {
            return res.status(500).json({ error: 'Database error' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}; 