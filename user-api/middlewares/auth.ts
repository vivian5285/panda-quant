import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AuthUser, AuthRequest } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(403).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: '无效的认证令牌'
    });
  }
};

// 生成 JWT token
export const generateToken = (userId: string, role: 'user' | 'admin'): string => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}; 