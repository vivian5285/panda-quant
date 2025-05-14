import { Schema, model } from 'mongoose';
import { IAlert } from '../types';

const AlertSchema = new Schema<IAlert>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  level: { type: String, required: true, enum: ['info', 'warning', 'error'] },
  createdAt: { type: Date, required: true },
  userId: { type: String, required: true }
});

export default model<IAlert>('Alert', AlertSchema); 