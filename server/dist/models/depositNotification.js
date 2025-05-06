import mongoose, { Schema } from 'mongoose';
const depositNotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    depositId: { type: Schema.Types.ObjectId, ref: 'Deposit', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
export const DepositNotification = mongoose.model('DepositNotification', depositNotificationSchema);
export default DepositNotification;
//# sourceMappingURL=DepositNotification.js.map