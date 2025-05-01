"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    referrerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('User', userSchema);
