"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userLevelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: mongoose_1.Schema.Types.Mixed, required: true },
    benefits: { type: mongoose_1.Schema.Types.Mixed, required: true },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('UserLevel', userLevelSchema);
