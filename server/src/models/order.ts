import { Schema, model, Document } from 'mongoose';
import { IOrder, OrderType, OrderStatus } from '../types/Trading';

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  positionId: { type: Schema.Types.ObjectId, ref: 'Position' },
  exchange: { type: String, required: true },
  symbol: { type: String, required: true },
  orderId: { type: String, required: true },
  clientOrderId: { type: String, required: true },
  type: { type: String, enum: Object.values(OrderType), required: true },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  amount: { type: Number, required: true },
  price: { type: Number },
  stopPrice: { type: Number },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  filledAmount: { type: Number, default: 0 },
  averageFillPrice: { type: Number },
  fee: { type: Number, default: 0 },
  feeCurrency: { type: String, required: true },
  error: { type: String },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
}, {
  timestamps: true
});

// 添加索引
orderSchema.index({ userId: 1 });
orderSchema.index({ strategyId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ clientOrderId: 1 });

// 在保存前更新 updatedAt
orderSchema.pre('save', function(next) {
  this.set('updatedAt', new Date());
  next();
});

export const Order = model<IOrder>('Order', orderSchema); 