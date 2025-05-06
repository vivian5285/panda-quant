import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthUser } from '../types/auth';

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
      id: decoded.id,
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      password: '',
      name: '',
      balance: 0,
      hostingFee: 0,
      subscriptionFee: 0,
      accountBalance: 0,
      subscriptionEndDate: null,
      status: 'active',
      referralCode: '',
      referralRewards: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      totalDeposits: 0,
      depositAddresses: []
    };
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: '无效的认证令牌'
    });
    return;
  }
}; 