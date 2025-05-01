import { Types } from 'mongoose';

export interface IBlacklistEntry {
  _id: Types.ObjectId;
  address: string;
  reason: string;
  status: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 