import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}; 