"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositNotification = void 0;
const mongoose_1 = require("mongoose");
const depositNotificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    txHash: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.DepositNotification = (0, mongoose_1.model)('DepositNotification', depositNotificationSchema);
exports.default = exports.DepositNotification;
//# sourceMappingURL=DepositNotification.js.map