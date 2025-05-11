import { Schema, model } from 'mongoose';
import { IExchange, IExchangeDocument } from '../types/Exchange';

const exchangeSchema = new Schema<IExchangeDocument>(
  {
    name: {
      type: String,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    },
    apiSecret: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
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

export const Exchange = model<IExchangeDocument>('Exchange', exchangeSchema); 