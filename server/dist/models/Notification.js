import mongoose, { Schema } from 'mongoose';
const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
//# sourceMappingURL=Notification.js.map