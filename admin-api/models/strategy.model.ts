import mongoose from 'mongoose';

export interface IStrategy {
    name: string;
    description: string;
    type: string;
    status: string;
    parameters: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const strategySchema = new mongoose.Schema<IStrategy>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'active' },
    parameters: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Strategy = mongoose.model<IStrategy>('Strategy', strategySchema); 