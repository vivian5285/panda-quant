import { Document } from 'mongoose';

export interface IPosition {
  userId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPositionDocument extends IPosition, Document {} 