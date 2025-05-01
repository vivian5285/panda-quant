import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types/auth';
import { IUser } from '../types/user';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key') as { userId: string };
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Convert Mongoose document to plain object and ensure all required fields are present
    const userObj = user.toObject();
    const userId = user._id as Types.ObjectId;
    
    // Create a new object with all required fields
    const userData: IUser = {
      _id: userId,
      id: userId.toString(),
      email: userObj.email,
      password: userObj.password,
      username: userObj.username,
      name: userObj.name || '',
      level: userObj.level || 1,
      role: userObj.role || 'user',
      status: userObj.status || 'active',
      permissions: userObj.permissions || [],
      isAdmin: userObj.role === 'admin',
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt
    };

    (req as AuthenticatedRequest).user = userData;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 