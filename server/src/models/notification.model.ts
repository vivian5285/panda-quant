import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'trade' | 'account' | 'other';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'trade' | 'account' | 'other';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, enum: ['system', 'trade', 'account', 'other'], required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);
export default Notification; 