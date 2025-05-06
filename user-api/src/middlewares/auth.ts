import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/auth.types';
import { User, IUser } from '../models/User';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as AuthUser;
    const user = await User.findById(decoded.id) as IUser | null;
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = {
      id: user._id instanceof Types.ObjectId ? user._id.toString() : user._id,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}; 