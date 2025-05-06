import mongoose, { Schema } from 'mongoose';
const UserEarningSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    settlementId: { type: Schema.Types.ObjectId, ref: 'Settlement', required: true },
    amount: { type: Number, required: true },
    level: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
export const UserEarning = mongoose.model('UserEarning', UserEarningSchema);
//# sourceMappingURL=UserEarning.js.map