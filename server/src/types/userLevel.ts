import { Document } from 'mongoose';

export interface IUserLevel extends Document {
  name: string;
  level: number;
  description?: string;
  experience: number;
  requiredExperience: number;
  minCommission: number;
  maxCommission: number;
  requirements: {
    minBalance?: number;
    minTrades?: number;
    minVolume?: number;
  };
  benefits: {
    commissionRate?: number;
    withdrawalLimit?: number;
    features?: string[];
  };
  achievements?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
} 