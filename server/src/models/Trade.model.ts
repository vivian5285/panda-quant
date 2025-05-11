import { Schema, model, Document, Types } from 'mongoose';
import { TradeStatus, TradeType } from '../types/Enums';

export interface ITrade {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  type: TradeType;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  status: TradeStatus;
  profit?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITradeDocument extends Omit<Document, '_id'>, ITrade {
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
    enum: Object.values(TradeType),
    required: true
  },
  side: {
    type: String,
    enum: ['buy', 'sell'],
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
    enum: Object.values(TradeStatus),
    default: TradeStatus.OPEN
  },
  profit: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 添加复合索引
tradeSchema.index({ userId: 1 });
tradeSchema.index({ strategyId: 1 });
tradeSchema.index({ symbol: 1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ createdAt: 1 });

export const Trade = model<ITradeDocument>('Trade', tradeSchema); 