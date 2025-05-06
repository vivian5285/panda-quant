import mongoose, { Schema } from 'mongoose';
const withdrawalSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    network: { type: String, required: true },
    address: { type: String, required: true },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加索引
withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ createdAt: -1 });
export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;
//# sourceMappingURL=Withdrawal.js.map