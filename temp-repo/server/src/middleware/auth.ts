import { Request, Response, NextFunction } from 'express';

export interface User {
  id: string;
  role: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  try {
    // TODO: 实现JWT验证逻辑
    const user = {
      id: 'user-id',
      role: 'user',
      permissions: ['read']
    };
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin only.'
    });
  }
  next();
};

export const hasPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
    next();
  };
}; 