"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAsset = void 0;
const mongoose_1 = require("mongoose");
const userAssetSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    assetId: { type: String, required: true },
    amount: { type: Number, required: true },
    balance: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    lastFeeDeduction: { type: Date },
    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.UserAsset = (0, mongoose_1.model)('UserAsset', userAssetSchema);
