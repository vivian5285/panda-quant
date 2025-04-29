import { Schema, model, Document } from 'mongoose';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface IStrategy extends Document {
  id: string;
  userId: string;
  name: string;
  description: string;
  riskLevel: RiskLevel;
  active: boolean;
  parameters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema<IStrategy>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    required: true 
  },
  active: { type: Boolean, default: true },
  parameters: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Strategy = model<IStrategy>('Strategy', strategySchema); 