import mongoose, { Schema } from 'mongoose';
import { IDepositNotification, IDepositNotificationDocument } from '../types/DepositNotification';

const depositNotificationSchema = new Schema<IDepositNotificationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  depositId: { type: Schema.Types.ObjectId, ref: 'Deposit', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const DepositNotification = mongoose.model<IDepositNotificationDocument>('DepositNotification', depositNotificationSchema);
export default DepositNotification; 