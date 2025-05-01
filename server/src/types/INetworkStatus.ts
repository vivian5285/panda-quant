import { Document } from 'mongoose';

export interface INetworkStatus extends Document {
  userId: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  metadata?: {
    ip?: string;
    location?: string;
    device?: string;
  };
} 