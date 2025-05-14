import { Schema, model } from 'mongoose';
import { Order, OrderStatus, OrderType, OrderSide } from '../types';

const OrderSchema = new Schema<Order>({
  id: { type: String, required: true },
  symbol: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(OrderType) },
  side: { type: String, required: true, enum: Object.values(OrderSide) },
  status: { type: String, required: true, enum: Object.values(OrderStatus) },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  filledQuantity: { type: Number, required: true },
  remainingQuantity: { type: Number, required: true },
  averagePrice: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  strategyId: { type: String },
  metadata: { type: Schema.Types.Mixed },
  retryCount: { type: Number, default: 0 }
});

export default model<Order>('Order', OrderSchema); 