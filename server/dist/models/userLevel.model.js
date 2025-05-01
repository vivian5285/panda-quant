"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevel = void 0;
const mongoose_1 = require("mongoose");
const userLevelSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    experience: {
        type: Number,
        required: true,
        default: 0
    },
    achievements: [{
            type: String
        }],
    metadata: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: true
});
exports.UserLevel = (0, mongoose_1.model)('UserLevel', userLevelSchema);
//# sourceMappingURL=userLevel.model.js.map