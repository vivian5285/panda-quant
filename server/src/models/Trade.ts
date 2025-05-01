import { Schema, model, Document, Types } from 'mongoose';
import { ITrade } from '../types/trade';

export type TradeStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

export interface ITradeDocument extends ITrade, Document {
  _id: Types.ObjectId;
}

const tradeSchema = new Schema<ITradeDocument>({
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
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export const Trade = model<ITradeDocument>('Trade', tradeSchema);
export default Trade; 