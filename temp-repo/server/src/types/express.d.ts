import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        username: string;
        email: string;
        role: string;
      } & Document;
    }
  }
} 