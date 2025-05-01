import { Schema, model } from 'mongoose';
import { IStrategy } from '../types';

const strategySchema = new Schema<IStrategy>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  parameters: { type: Schema.Types.Mixed, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'inactive' },
}, {
  timestamps: true
});

export default model<IStrategy>('Strategy', strategySchema); 