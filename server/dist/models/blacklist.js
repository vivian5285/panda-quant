import mongoose, { Schema } from 'mongoose';
import { BlacklistStatus, BlacklistType } from '../types/Blacklist';
const blacklistEntrySchema = new Schema({
    type: {
        type: String,
        enum: Object.values(BlacklistType),
        required: true
    },
    value: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(BlacklistStatus),
        default: BlacklistStatus.ACTIVE
    },
    address: {
        type: String
    },
    metadata: {
        type: Schema.Types.Mixed
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
export const BlacklistEntry = mongoose.model('BlacklistEntry', blacklistEntrySchema);
//# sourceMappingURL=Blacklist.js.map