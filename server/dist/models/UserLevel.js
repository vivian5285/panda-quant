import mongoose, { Schema } from 'mongoose';
const userLevelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    minDeposit: {
        type: Number,
        required: true
    },
    maxDeposit: {
        type: Number,
        required: true
    },
    commissionRate: {
        type: Number,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    requiredExperience: {
        type: Number,
        required: true
    },
    minCommission: {
        type: Number,
        required: true
    },
    maxCommission: {
        type: Number,
        required: true
    },
    benefits: [{
            type: String
        }],
    achievements: [{
            type: String
        }],
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
export const UserLevel = mongoose.model('UserLevel', userLevelSchema);
export default UserLevel;
//# sourceMappingURL=UserLevel.js.map