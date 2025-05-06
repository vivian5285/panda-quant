import { Schema, model, Types } from 'mongoose';
const riskEventSchema = new Schema({
    userId: {
        type: Types.ObjectId,
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
        type: Schema.Types.Mixed,
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
export const RiskEvent = model('RiskEvent', riskEventSchema);
//# sourceMappingURL=RiskEvent.js.map