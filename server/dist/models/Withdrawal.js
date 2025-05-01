"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = void 0;
const mongoose_1 = require("mongoose");
const withdrawalSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    walletAddress: { type: String, required: true },
    paymentMethod: {
        type: String,
        enum: ['crypto', 'bank', 'paypal'],
        required: true
    },
    paymentDetails: { type: mongoose_1.Schema.Types.Mixed, required: true },
    metadata: { type: mongoose_1.Schema.Types.Mixed, default: {} }
}, {
    timestamps: true
});
exports.Withdrawal = (0, mongoose_1.model)('Withdrawal', withdrawalSchema);
exports.default = exports.Withdrawal;
//# sourceMappingURL=Withdrawal.js.map