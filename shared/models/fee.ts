import mongoose, { Document } from 'mongoose';
import { IUser } from './user';
import { IAsset } from './asset';

export interface IFee extends Document {
    userId: string;
    amount: number;
    type: string;
    status: 'pending' | 'completed';
    createdAt: Date;
    updatedAt: Date;
    user?: IUser;
    asset?: IAsset;
}

const feeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assetId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'trade', 'commission'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 添加虚拟字段
feeSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

feeSchema.virtual('asset', {
    ref: 'Asset',
    localField: 'assetId',
    foreignField: '_id',
    justOne: true
});

// 设置虚拟字段在JSON输出中包含
feeSchema.set('toJSON', { virtuals: true });
feeSchema.set('toObject', { virtuals: true });

export const Fee = mongoose.model<IFee>('Fee', feeSchema); 