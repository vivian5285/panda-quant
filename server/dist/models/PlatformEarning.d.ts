import mongoose, { Document } from 'mongoose';
export interface IPlatformEarning extends Document {
    userId: string;
    strategyId: string;
    amount: number;
    currency: string;
    type: 'commission' | 'fee' | 'other';
    description?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PlatformEarning: mongoose.Model<IPlatformEarning, {}, {}, {}, mongoose.Document<unknown, {}, IPlatformEarning, {}> & IPlatformEarning & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PlatformEarning.d.ts.map