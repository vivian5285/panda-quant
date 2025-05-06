import mongoose, { Schema } from 'mongoose';
const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'trade', 'commission'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    referenceId: { type: Schema.Types.ObjectId, required: true },
    referenceType: { type: String, enum: ['Deposit', 'Withdrawal', 'CommissionRecord'], required: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加索引
transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
export const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
//# sourceMappingURL=Transaction.js.map