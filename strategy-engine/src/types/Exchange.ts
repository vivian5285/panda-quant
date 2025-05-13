import { Types } from 'mongoose';

export interface IExchange {
  _id: Types.ObjectId;
  name: string;
  type: 'spot' | 'futures';
  apiKey: string;
  apiSecret: string;
  userId: Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface IExchangeConfig {
  name: string;
  baseUrl: string;
  apiVersion: string;
  endpoints: {
    market: string;
    order: string;
    account: string;
  };
  rateLimit: {
    requests: number;
    perSecond: number;
  };
} 