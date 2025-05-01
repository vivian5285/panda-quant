import mongoose, { Schema, Document } from 'mongoose';
import { IAlert } from '../types/alert';

const alertSchema = new Schema<IAlert & Document>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['price', 'volume', 'technical', 'strategy_loss', 'news', 'system'] 
  },
  condition: { type: String, required: true },
  value: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['active', 'triggered', 'disabled'],
    default: 'active'
  },
  exchange: { type: String, required: true },
  symbol: { type: String, required: true },
  timeframe: { type: String },
  triggeredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  error: { type: String },
  metadata: { type: Schema.Types.Mixed },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  isRead: { type: Boolean, default: false }
});

alertSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Alert = mongoose.model<IAlert & Document>('Alert', alertSchema); 