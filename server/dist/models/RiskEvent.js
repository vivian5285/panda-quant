"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEvent = void 0;
const mongoose_1 = require("mongoose");
const riskEventSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['withdrawal', 'deposit', 'trade', 'login', 'other'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
exports.RiskEvent = (0, mongoose_1.model)('RiskEvent', riskEventSchema);
//# sourceMappingURL=RiskEvent.js.map