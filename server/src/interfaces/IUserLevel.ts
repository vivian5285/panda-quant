import { Document } from 'mongoose';

export interface IUserLevel extends Document {
  _id: string;
  name: string;
  description: string;
  requirements: {
    minCommission: number;
    minTrades: number;
  };
  benefits: {
    commissionRate: number;
    withdrawalLimit: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 