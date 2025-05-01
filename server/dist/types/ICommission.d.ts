import { Types } from 'mongoose';
export interface ICommission {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    status: string;
    type: string;
    description?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
