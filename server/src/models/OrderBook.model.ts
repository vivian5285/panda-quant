import { Schema, model, Document, Types } from 'mongoose';
import { IOrderBook } from '../types/OrderBook';

export interface IOrderBookDocument extends IOrderBook, Document {
  _id: Types.ObjectId;
}

const orderBookSchema = new Schema<IOrderBookDocument>(
  {
    exchange: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    bids: {
      type: [[Number]],
      required: true
    },
    asks: {
      type: [[Number]],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const OrderBook = model<IOrderBookDocument>('OrderBook', orderBookSchema); 