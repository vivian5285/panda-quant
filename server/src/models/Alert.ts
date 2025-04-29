import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IAlert extends Document {
  userId: Types.ObjectId;
  type: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Alert = mongoose.model<IAlert>('Alert', alertSchema); 