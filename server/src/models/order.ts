import { Schema, model } from 'mongoose';
import { IOrder } from '../types/IOrder';

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 添加索引
orderSchema.index({ userId: 1 });
orderSchema.index({ strategyId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// 在保存前更新 updatedAt
orderSchema.pre('save', function(next) {
  this.set('updatedAt', new Date());
  next();
});

export const Order = model<IOrder>('Order', orderSchema); 