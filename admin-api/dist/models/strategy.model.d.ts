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
export declare const Strategy: mongoose.Model<IStrategy, {}, {}, {}, mongoose.Document<unknown, {}, IStrategy, {}> & IStrategy & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
