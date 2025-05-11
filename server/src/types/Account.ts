import { Document, Types } from 'mongoose';

export interface IAccount {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  exchange: string;
  apiKey: string;
  apiSecret: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountDocument extends Omit<IAccount, '_id'>, Document {} 