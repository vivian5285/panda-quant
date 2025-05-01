import { Types } from 'mongoose';
export interface IOrder {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    symbol: string;
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
