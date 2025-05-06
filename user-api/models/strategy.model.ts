import { Schema, model, Document } from 'mongoose';

export interface IStrategy extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  description: string;
  parameters: Record<string, number>;
  status: 'active' | 'inactive' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema<IStrategy>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  parameters: {
    type: Map,
    of: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused'],
    default: 'inactive'
  }
}, {
  timestamps: true
});

export const Strategy = model<IStrategy>('Strategy', strategySchema); 