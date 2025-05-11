import { Types } from 'mongoose';

export interface IWallet {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  balances: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWalletDocument extends IWallet {
  save(): Promise<IWalletDocument>;
} 