import jwt from 'jsonwebtoken';
import { IUser } from '@shared/models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (user: IUser): string => {
  if (!user._id) {
    throw new Error('User ID is required');
  }
  return jwt.sign(
    { 
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as JwtPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
}; 