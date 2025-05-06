import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthUser } from '../types/auth';
import { IUser } from '../models/user.model';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: '未提供认证令牌'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthUser;
    req.user = {
      ...decoded,
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role
    } as AuthUser;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: '无效的认证令牌'
    });
    return;
  }
}; 