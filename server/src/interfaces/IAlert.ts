import { Document } from 'mongoose';

export interface IAlert extends Document {
  _id: string;
  type: 'price' | 'volume' | 'technical';
  condition: string;
  value: number;
  status: 'active' | 'triggered' | 'disabled';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
} 