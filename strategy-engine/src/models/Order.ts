import { Schema, model } from 'mongoose';
import { IOrder, OrderStatus } from '../types';

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  strategyId: { type: Schema.Types.ObjectId, required: true, ref: 'Strategy' },
  symbol: { type: String, required: true },
  side: { type: String, required: true, enum: ['buy', 'sell'] },
  type: { type: String, required: true, enum: ['market', 'limit'] },
  price: { type: Number },
  amount: { type: Number, required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
}, {
  timestamps: true
});

export default model<IOrder>('Order', orderSchema); 