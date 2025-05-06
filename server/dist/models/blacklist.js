"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacklist = void 0;
const mongoose_1 = require("mongoose");
const Blacklist_1 = require("../types/Blacklist");
const blacklistSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    type: {
        type: String,
        enum: Object.values(Blacklist_1.BlacklistType),
        required: true
    },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(Blacklist_1.BlacklistStatus),
        default: Blacklist_1.BlacklistStatus.ACTIVE,
        required: true
    },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
blacklistSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});
exports.Blacklist = (0, mongoose_1.model)('Blacklist', blacklistSchema);
//# sourceMappingURL=Blacklist.js.map