import { Schema, model, Document, Types } from 'mongoose';
import { OrderStatus, OrderType, OrderSide, TimeInForce } from '../types/Enums';

export interface IOrderBase {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  status: OrderStatus;
  price: number;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  timeInForce: TimeInForce;
  metadata?: Record<string, any>;
}

export interface IOrder extends IOrderBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
}

const orderSchema = new Schema<IOrderDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: Object.values(OrderType), required: true },
  side: { type: String, enum: Object.values(OrderSide), required: true },
  status: { type: String, enum: Object.values(OrderStatus), required: true, default: OrderStatus.PENDING },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  filledQuantity: { type: Number, required: true, default: 0 },
  remainingQuantity: { type: Number, required: true },
  timeInForce: { type: String, enum: Object.values(TimeInForce), required: true },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

orderSchema.index({ userId: 1 });
orderSchema.index({ strategyId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });

export const Order = model<IOrderDocument>('Order', orderSchema);
export default Order; 