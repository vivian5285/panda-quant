import { Schema, model } from 'mongoose';
import { IAlert } from '../types';

const alertSchema = new Schema<IAlert>({
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ['price', 'volume', 'technical'] },
  condition: { type: String, required: true },
  value: { type: Number, required: true },
  status: { type: String, required: true, enum: ['active', 'triggered', 'disabled'], default: 'active' },
}, {
  timestamps: true
});

export default model<IAlert>('Alert', alertSchema); 