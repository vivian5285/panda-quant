import { Document } from 'mongoose';

export interface IStrategy extends Document {
  _id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated';
  status: 'active' | 'inactive' | 'testing';
  userId: string;
  parameters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 