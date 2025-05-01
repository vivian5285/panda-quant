"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevel = void 0;
const mongoose_1 = require("mongoose");
const userLevelSchema = new mongoose_1.Schema({
    level: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    experience: {
        type: Number,
        required: true,
        default: 0
    },
    requiredExperience: {
        type: Number,
        required: true,
        default: 0
    },
    minCommission: {
        type: Number,
        required: true,
        default: 0
    },
    maxCommission: {
        type: Number,
        required: true,
        default: 0
    },
    requirements: {
        minBalance: { type: Number, default: 0 },
        minTrades: { type: Number, default: 0 },
        minVolume: { type: Number, default: 0 }
    },
    benefits: {
        commissionRate: { type: Number, default: 0 },
        withdrawalLimit: { type: Number, default: 0 },
        features: [{ type: String }]
    },
    achievements: {
        type: [String],
        default: []
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});
exports.UserLevel = (0, mongoose_1.model)('UserLevel', userLevelSchema);
exports.default = exports.UserLevel;
//# sourceMappingURL=UserLevel.js.map