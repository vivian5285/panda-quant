import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  apiKeys: Array<{
    exchange: string;
    apiKey: string;
    apiSecret: string;
    isActive: boolean;
    createdAt: Date;
    lastUsedAt?: Date;
  }>;
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      telegram: boolean;
      discord: boolean;
    };
    defaultExchange: string;
    defaultTimeframe: string;
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export type User = IUser; 