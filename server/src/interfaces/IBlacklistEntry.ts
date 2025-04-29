import { Document } from 'mongoose';

export interface IBlacklistEntry extends Document {
  _id: string;
  userId: string;
  username: string;
  email: string;
  reason: string;
  type: 'spam' | 'fraud' | 'abuse' | 'other';
  status: 'active' | 'expired';
  expiresAt: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
} 