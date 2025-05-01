"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blacklistEntrySchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    value: { type: String, required: true },
    reason: { type: String, required: true },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('BlacklistEntry', blacklistEntrySchema);
