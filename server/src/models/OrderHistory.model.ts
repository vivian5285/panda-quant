import { Schema, model, Document, Types } from 'mongoose';
import { IOrderHistory } from '../types/OrderHistory';

export interface IOrderHistoryDocument extends IOrderHistory, Document {
  _id: Types.ObjectId;
}

const orderHistorySchema = new Schema<IOrderHistoryDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    strategyId: {
      type: Schema.Types.ObjectId,
      ref: 'Strategy',
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    side: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const OrderHistory = model<IOrderHistoryDocument>('OrderHistory', orderHistorySchema); 