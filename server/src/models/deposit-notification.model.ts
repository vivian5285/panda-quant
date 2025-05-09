import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDepositNotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  depositId: Types.ObjectId;
  message: string;
  isRead: boolean;
  type: 'success' | 'error' | 'info';
  amount: number;
  currency: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepositNotificationDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  depositId: Types.ObjectId;
  message: string;
  isRead: boolean;
  type: 'success' | 'error' | 'info';
  amount: number;
  currency: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const depositNotificationSchema = new Schema<IDepositNotificationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  depositId: { type: Schema.Types.ObjectId, ref: 'Deposit', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ['success', 'error', 'info'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
depositNotificationSchema.index({ userId: 1 });
depositNotificationSchema.index({ depositId: 1 });
depositNotificationSchema.index({ type: 1 });
depositNotificationSchema.index({ isRead: 1 });
depositNotificationSchema.index({ createdAt: -1 });

export const DepositNotification = mongoose.model<IDepositNotificationDocument>('DepositNotification', depositNotificationSchema);
export default DepositNotification; 