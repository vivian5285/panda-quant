import { Document, Types } from 'mongoose';
export interface IRiskEvent extends Document {
    _id: Types.ObjectId;
    type: string;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface RiskEventCreateInput extends Omit<IRiskEvent, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface RiskEventUpdateInput extends Partial<RiskEventCreateInput> {
}
