"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fee = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const feeSchema = new mongoose_1.default.Schema({
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
exports.Fee = mongoose_1.default.model('Fee', feeSchema);
