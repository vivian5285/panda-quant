import { Schema, model, Document, Types } from 'mongoose';
import { IDepositNotification } from '../types/notification';

export interface IDepositNotificationDocument extends IDepositNotification, Document {
  _id: Types.ObjectId;
}

const depositNotificationSchema = new Schema<IDepositNotificationDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const DepositNotification = model<IDepositNotificationDocument>('DepositNotification', depositNotificationSchema);
export default DepositNotification; 