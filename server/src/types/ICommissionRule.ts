import { Document } from 'mongoose';

export interface ICommissionRule {
  name: string;
  description: string;
  rate: number;
  minAmount: number;
  maxAmount?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionRuleDocument extends ICommissionRule, Document {} 