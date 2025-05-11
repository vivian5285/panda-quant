import { Schema, model } from 'mongoose';
import { IAccountDocument } from '../types/Account';

const accountSchema = new Schema<IAccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    exchange: {
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
      required: true,
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

export const Account = model<IAccountDocument>('Account', accountSchema); 