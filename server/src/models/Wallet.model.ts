import { Schema, model } from 'mongoose';
import { IWalletDocument } from '../types/Wallet';

const walletSchema = new Schema<IWalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    balances: {
      type: Map,
      of: Number,
      default: new Map()
    }
  },
  {
    timestamps: true
  }
);

export const Wallet = model<IWalletDocument>('Wallet', walletSchema); 