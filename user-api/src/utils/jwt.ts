import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  id: string;
  email: string;
}

export function generateToken(user: IUser, expiresIn: string = '24h'): string {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
} 